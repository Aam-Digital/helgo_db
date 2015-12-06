'use strict';

/**
 * @ngdoc service
 * @name hdbApp.User
 * @description
 * Class for User entity. Provides entity specific functions.
 */
angular.module('hdbApp')
    .factory('User', ['AbstractModel', 'appConfig', function (AbstractModel, appConfig) {
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
            authenticate: function (password) {
                return (CryptoJS.PBKDF2(password, appConfig.crypto.salt,
                    {keySize: appConfig.crypto.keysize, iterations: appConfig.crypto.iterations}) == this.password);
            },
        });

        return User;
    }]);

