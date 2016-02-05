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
            ajax: {
                rejectUnauthorized: false,
                timeout: appConfig.database.timeout
            }
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
                .then(function () {
                        $log.debug("Remote login successful.");
                    },
                    function (error) {
                        $log.error("Could not log in to the remote database. (" + error.message + ")");
                    });
        };

        db.sync = function (syncLive) {
            return PouchDB.sync(db, remoteDB, {
                live: syncLive,
                retry: syncLive
            }).then(
                function () {
                    $log.debug("sync successfully");
                }, function (err) {
                    $log.debug("sync failed:");
                    $log.debug(err);
                },
                function (notify) {
                    $log.debug("sync notification:");
                    $log.debug(notify);
                }
            );
        };

        db.logout = function () {
            return db.remoteDB.logout();
        };

        return db;
    }]);
