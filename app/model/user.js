PREFIX_USER = "user:";

angular.module('myApp.user', [
    'myApp.appDB',
])

    .factory('User', ['appDB', function ($log, appDB) {
        function User(data) {
            if (data) {
                this.setData(data);
                this._id = PREFIX_USER+data.name;
            }
        };

        User.prototype = {
            setData: function (data) {
                angular.extend(this, data);
                return this;
            },
            delete: function () {
                appDB.delete(this);
            },
            update: function () {
                appDB.put(this);
            },
            authenticate: function(password) {
                return (password == this.password);
            },
        };

        return User;
    }])


    .factory('userManager', ['appDB', 'DbManager', '$q', 'User', function (appDB, DbManager, $q, User) {
        var prefix = PREFIX_USER;
        var manager = new DbManager(PREFIX_USER, User);

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
                            deferred.resolve({ok: true});
                        }
                        else {
                            deferred.resolve({ok: false, info: "Username or password wrong."});
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

        });

        return manager;
    }]);
