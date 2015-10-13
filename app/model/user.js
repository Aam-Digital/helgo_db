
angular.module('myApp.user', [
    'myApp.appDB',
    'version',
])

    .factory('User', ['AbstractModel', function (AbstractModel) {
        var prefix = "user:";

        function User(data) {
            if (data) {
                this.setData(data);
                this._id = prefix + data.name;

                if (this.settings === undefined) {
                    this.settings = {};
                }
            }
        };

        User.prefix = prefix;

        User.prototype = angular.extend({}, AbstractModel, {
            authenticate: function(password) {
                return (hashFnv32a(password) == this.password);
            },
        });

        return User;
    }])


    .factory('userManager', ['appDB', 'DbManager', '$q', 'User', 'latestChanges', 'appInfo', function (appDB, DbManager, $q, User, latestChanges, appInfo) {
        var manager = new DbManager(User);

        angular.extend(manager, {
            _currentUser: null,

            /* Public Methods */

            login: function(username, password) {
                var deferred = $q.defer();
                var scope = this;

                appDB.login(username, password);

                this.get(username).then(
                    function(user) {
                        if(user.authenticate(password)) {
                            scope._currentUser = user;

                            latestChanges.check(user.settings.lastKnownVersion);
                            appInfo.then(function (info) {
                                if (user.settings.lastKnownVersion != info.version) {
                                    user.settings.lastKnownVersion = info.version;
                                    user.update();
                                    $log.info("Updated to new version.");
                                }
                            });

                            deferred.resolve({ok: true});
                        }
                        else {
                            deferred.reject({ok: false, message: "Username or password wrong."});
                        }
                    },
                    function(err) {
                        deferred.reject({ok: false, message: "Username or password wrong."});
                    }
                );
                return deferred.promise;
            },
            logout: function() {
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
                        user.password = hashFnv32a(newPassword);
                        user.update().then(
                            function () {
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
