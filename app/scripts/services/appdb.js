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

    .factory('appDB', ['$log', 'pouchDB', 'appConfig', 'cookie', function ($log, pouchDB, appConfig, cookie) {

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
                        throw( error );
                    });
        };

        db.sync = function () {
            // Try a single database replication first.
            $log.debug("Trying database replication.");

            return PouchDB.sync(db, remoteDB, {
                live: false,
                retry: false
            }).then(
                function () {
                    $log.debug("Replication has been successful, trying live sync now.");
                    cookie.setLastSyncCompleted();

                    PouchDB.sync(db, remoteDB, {
                        live: true,
                        retry: true
                    }).then(
                        function () {
                            $log.debug("Live sync is running.")
                        }, function (err) {
                            $log.debug("Cannot activate live sync:");
                            $log.debug(err);
                        }
                    );
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

        db.isOutdated = function () {
            var lastSyncCompleted = cookie.getLastSyncCompleted();
            var currentDate = new Date();
            var outdatedThreshold = appConfig.database.warn_database_outdated_after_days * 24 * 60 * 60 * 1000;

            return (currentDate.getTime() - lastSyncCompleted.getTime()) > outdatedThreshold;
        };

        db.logout = function () {
            return db.remoteDB.logout();
        };

        return db;
    }]);
