'use strict';

/**
 * @ngdoc service
 * @name hdbApp.appDb
 * @description
 * # appDb
 * Database access object using PouchDB.
 */
angular.module('hdbApp')

    .config(function (pouchDBProvider, POUCHDB_METHODS) {
        // nolanlawson/pouchdb-authentication
        var authMethods = {
            login: 'qify',
            logout: 'qify',
            getUser: 'qify'
        };
        pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
    })

    .factory('appDB', ['$log', 'pouchDB', 'appConfig', function ($log, pouchDB, appConfig) {

        var remoteDB = pouchDB(appConfig.database.remote_url + appConfig.database.name, {
            skipSetup: true,
            ajax: {rejectUnauthorized: false}
        });

        var db = pouchDB(appConfig.database.name);
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
                    $log.debug("Remote login succesfull. Trying to sync with remoteDB ...");
                    db.replicate.sync(remoteDB, {
                        live: true,
                        retry: true
                    }).then(
                        function () {
                            $log.debug("successfully syncing with remoteDB");
                        },
                        function (err) {
                            $log.error("failed to sync with remoteDB");
                            $log.error(err);
                        },
                        function (note) {
                            $log.debug("trying to sync remoteDB: ");
                            $log.debug(note);
                        }
                    );
                },
                function (error) {
                    $log.error("Could not log in to the remote database. (" + error.message + ")");
                });
        };

        db.logout = function () {
            return db.remoteDB.logout();
        };

        return db;
    }]);
