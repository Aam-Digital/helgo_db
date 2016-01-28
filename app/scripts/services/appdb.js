'use strict';

/**
 * @ngdoc service
 * @name appDb
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
        var fileDbName = appConfig.database.name + "_files";

        var db = pouchDB(appConfig.database.name);
        db._remoteDB = setupRemoteDB(appConfig.database.name);
        db._fileDB = pouchDB(fileDbName);
        db._remoteFileDB = setupRemoteDB(fileDbName);

        db.sync = sync;
        db.login = login;
        db.logout = logout;

        db.putFile = putFile;
        db.getFile = getFile;

        return db;


        function setupRemoteDB(dbName) {
            return pouchDB(appConfig.database.remote_url + dbName, {
                skipSetup: true,
                ajax: {rejectUnauthorized: false}
            });
        }

        function login(username, password) {
            var ajaxOpts = {
                ajax: {
                    headers: {
                        Authorization: 'Basic ' + window.btoa(username + ':' + password)
                    }
                }
            };

            db._remoteFileDB.login(username, password, ajaxOpts).then(
                function () {
                },
                function (error) {
                    $log.error("Could not log in to the remote file database. (" + error.message + ")");
                });

            return db._remoteDB.login(username, password, ajaxOpts).then(
                function () {
                    $log.debug("Remote login successful.");
                },
                function (error) {
                    $log.error("Could not log in to the remote database. (" + error.message + ")");
                });
        }

        function sync(syncLive) {
            PouchDB.sync(db._fileDB, db._remoteFileDB, {live: syncLive, retry: syncLive});

            return PouchDB.sync(db, db._remoteDB, {live: syncLive, retry: syncLive}).then(
                function () {
                    $log.debug("sync successfully");
                },
                function (err) {
                    $log.debug("sync failed:");
                    $log.debug(err);
                },
                function (notify) {
                    $log.debug("sync notification:");
                    $log.debug(notify);
                });
        }

        function logout() {
            db._remoteDB.logout();
            db._remoteFileDB.logout();
        }


        function putFile(fileId, file, overwrite) {
            if (overwrite) {
                return db._fileDB.get(fileId).then(
                    function (doc) {
                        return db._fileDB.putAttachment(fileId, 'file', doc._rev, file, file.type)
                            .catch(function (err) {
                                $log.error("Could not save file to database: " + err.message);
                                return err;
                            });
                    },
                    function (err) {
                        if (err.status === 404) {
                            return db._fileDB.putAttachment(fileId, 'file', file, file.type)
                                .catch(function (err) {
                                    $log.error("Could not save file to database: " + err.message);
                                    return err;
                                });
                        }
                    }
                )
            } else {
                return db._fileDB.putAttachment(fileId, 'file', file, file.type)
                    .catch(function (err) {
                        $log.error("Could not save file to database: " + err.message);
                        return err;
                    });
            }
        }

        function getFile(fileId) {
            return db._fileDB.getAttachment(fileId, 'file').then(
                function (blob) {
                    return URL.createObjectURL(blob);
                },
                function (err) {
                    if (err.status != 404) {
                        $log.error("Could not load file (" + this._id + "): " + err.message);
                    }
                }
            );
        }
    }]);
