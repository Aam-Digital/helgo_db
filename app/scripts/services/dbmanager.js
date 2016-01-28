'use strict';

/**
 * @ngdoc service
 * @name hdbApp.DbManager
 * @description
 * Abstract base class for data access classes providing easy getters to the database.
 */
angular.module('hdbApp')
    .factory('DbManager', ['$log', '$q', 'appDB', function ($log, $q, appDB) {
        function DbManager(Model) {
            this._prefix = Model.prefix;
            this._model = Model;
        }

        DbManager.prototype = {
            _pool: {},
            _retrieveInstance: function (id, data) {
                var idParts = id.split(":");
                var prefixParts = this._prefix.split(":");
                if (idParts.length != prefixParts.length) {
                    return null;
                }

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
                    function (err) {
                        deferred.reject(err);
                    });
            },

            /* Public Methods */
            get: function (name) {
                var deferred = $q.defer();

                var id = this._prefix + name;
                if (name.startsWith(this._prefix)) {
                    id = name;
                }

                var o = this._search(id);
                if (o) {
                    deferred.resolve(o);
                } else {
                    this._load(id, deferred);
                }
                return deferred.promise;
            },

            uncache: function(name) {
                var id = this._prefix + name;
                delete this._pool[id];
            },

            getAll: function () {
                var deferred = $q.defer();
                var scope = this;
                appDB.allDocs({include_docs: true, startkey: this._prefix, endkey: this._prefix + "\ufff0"})
                    .then(function (dataArray) {
                        var items = [];
                        dataArray.rows.forEach(function (row) {
                            var data = row.doc;
                            var o = scope._retrieveInstance(data._id, data);
                            if (o != null) {
                                items.push(o);
                            }
                        });

                        deferred.resolve(items);
                    },
                    function (err) {
                        $log.error(err);
                        deferred.reject();
                    });
                return deferred.promise;
            }
        };

        return DbManager;
    }]);
