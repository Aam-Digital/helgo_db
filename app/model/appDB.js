angular.module('myApp.appDB', [
    'pouchdb',
])

    .config(function (pouchDBProvider, POUCHDB_METHODS) {
        // nolanlawson/pouchdb-authentication
        var authMethods = {
            login: 'qify',
            logout: 'qify',
            getUser: 'qify'
        };
        pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
    })

    .service('appDB', function ($log, pouchDB) {
        var remoteDB = pouchDB(DB_REMOTE + '/hdb', {skipSetup: true, ajax: {rejectUnauthorized: false}});

        var db = pouchDB('hdb');
        db.remoteDB = remoteDB;

        db.login = function (username, password) {
            var ajaxOpts = {
                ajax: {
                    headers: {
                        Authorization: 'Basic ' + window.btoa(username + ':' + password),
                    }
                }
            };
            return db.remoteDB.login(username, password, ajaxOpts)
                .then(
                function () {
                    db.replicate.sync(remoteDB, {
                        live: true,
                        retry: true
                    });
                },
                function (error) {
                    $log.error("Could not log in to the remote database. (" + error.message + ")");
                });
        };

        db.logout = function () {
            return db.remoteDB.logout();
        };

        return db;
    })


    .factory('DbManager', ['$log', '$q', 'appDB', function ($log, $q, appDB) {
        function DbManager(prefix, Model) {
            this._prefix = prefix;
            this._model = Model;
        };

        DbManager.prototype = {
            _pool: {},
            _retrieveInstance: function (id, data) {
                var instance = this._pool[id];

                if (instance) {
                    instance.setData(data);
                } else {
                    instance = new this._model(data);
                    this._pool[id] = instance;
                }

                return instance;
            },
            _search: function (id) {
                return this._pool[id];
            },
            _load: function (id, deferred) {
                var scope = this;
                appDB.get(id)
                    .then(
                    function (data) {
                        var object = scope._retrieveInstance(id, data);
                        deferred.resolve(object);
                    },
                    function () {
                        deferred.reject();
                    });
            },

            /* Public Methods */
            get: function (name) {
                var id = this._prefix+name;
                var deferred = $q.defer();
                var o = this._search(id);
                if (o) {
                    deferred.resolve(o);
                } else {
                    this._load(id, deferred);
                }
                return deferred.promise;
            },

            getAll: function () {
                var deferred = $q.defer();
                var scope = this;
                console.log(this._prefix);
                appDB.allDocs({include_docs: true, startkey: this._prefix, endkey: this._prefix+"\ufff0"})
                    .then(function (dataArray) {
                        console.log(dataArray);
                        var items = [];
                        dataArray.rows.forEach(function (row) {
                            var data = row.doc;
                            var o = scope._retrieveInstance(data._id, data);
                            items.push(o);
                        });

                        deferred.resolve(items);
                    },
                    function (err) {
                        deferred.reject();
                    });
                return deferred.promise;
            },
        };

        return DbManager;
    }]);