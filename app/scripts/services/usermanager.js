'use strict';

/**
 * @ngdoc service
 * @name hdbApp.userManager
 * @description
 * Provides access to User entities in the database.
 */
angular.module('hdbApp')
    .factory('userManager', ['appDB', 'DbManager', '$q', '$log', 'User', 'latestChanges', 'appConfig', function (appDB, DbManager, $q, $log, User, latestChanges, appConfig) {
        var manager = new DbManager(User);

        angular.extend(manager, {
            _currentUser: null,

            /* Public Methods */

            login: function (username, password) {
                var deferred = $q.defer();
                var scope = this;

                this.get(username).then(
                    function (user) {
                        if (user.authenticate(password)) {
                            scope._currentUser = user;

                            latestChanges.check(user.settings.lastKnownVersion);
                            if (user.settings.lastKnownVersion != appConfig.version) {
                                user.settings.lastKnownVersion = appConfig.version;
                                user.update();
                                $log.info("Updated to new version.");
                            }

                            deferred.resolve({ok: true});
                        }
                        else {
                            deferred.reject({ok: false, message: "Username or password wrong."});
                        }
                    },
                    function (err) {
                        deferred.reject({ok: false, message: "Username or password wrong."});
                    }
                );
                return deferred.promise;
            },
            logout: function () {
                appDB.logout();
                this._currentUser = null;
            },
            isLoggedIn: function () {
                return (this._currentUser != null);
            },

            changePassword: function (user, newPassword) {
                var deferred = $q.defer();

                appDB.remoteDB.changePassword(user.name, newPassword).then(
                    function (response) {
                        $log.debug("Changed remote password");

                        // renew login with updated credentials
                        appDB.login(user.name, newPassword);

                        user.password = "" + CryptoJS.PBKDF2(newPassword, appConfig.crypto.salt, //TODO: newPassword instead password?!?
                            {keySize: appConfig.crypto.keysize, iterations: appConfig.crypto.iterations});
                        user.update().then(
                            function () {
                                $log.debug("Changed local password");
                                deferred.resolve();
                            },
                            function (err) {
                                $log.error("Failed to save local user after password change: " + err.message);
                                deferred.reject(err);
                            }
                        );

                    },
                    function (err) {
                        $log.error("Failed to change remote password: " + err.message);
                        deferred.reject(err);
                    }
                );

                return deferred.promise;
            },

            getCurrentUser: function () {
                return this._currentUser;
            },

            getAllSocialworkers: function () {
                return this.getAll().then(
                    function (users) {
                        var socialworkers = [];
                        users.forEach(function (user) {
                            if (user.socialworker) {
                                socialworkers.push(user);
                            }
                        });
                        return socialworkers;
                    }
                );
            },
        });

        return manager;
    }]);
