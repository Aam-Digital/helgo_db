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
        var remoteDB = pouchDB(DB_REMOTE + '/hdb', {skipSetup: true});

        var db = pouchDB('hdb');
        db.remoteDB = remoteDB;

        db.isLoggedIn = function () {
            db.remoteDB.getSession()
                .then(function (session) {
                    if (session.ok) {
                        db._loggedIn = true;
                    }
                    else {
                        db._loggedIn = false;
                    }
                })
                .catch(function (err) {
                    $log.error(err);
                    db._loggedIn = false;
                });

            // return previous known status immediately
            return db._loggedIn;
        };

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
                    db._loggedIn = true;
                    return {ok: true};
                },
                function (error) {
                    $log.error("Could not log in to the remote database. (" + error.message + ")");
                    db._loggedIn = false;
                    return {ok: false, info: error};
                });
        };

        db.logout = function () {
            return db.remoteDB.logout().then(
                function (res) {
                    db._loggedIn = false;
                }
            );
        };

        return db;
    });