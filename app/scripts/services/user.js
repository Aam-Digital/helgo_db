'use strict';

/**
 * @ngdoc service
 * @name hdbApp.User
 * @description
 * Class for User entity. Provides entity specific functions.
 */
angular.module('hdbApp')
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
            authenticate: function (password) {
                return (hashFnv32a(password) == this.password);
            },
        });

        return User;
    }]);


/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false */
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}