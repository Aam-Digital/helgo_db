'use strict';

/**
 * @ngdoc service
 * @name hdbApp.cookie
 * @description
 * # cookie
 * Service in the hdbApp.
 */
angular.module('hdbApp')
    .service('cookie', ['$cookies', function ($cookies) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var lastSyncTag = "last_sync";

        this.setLastSyncCompleted = function () {
            var currentDate = new Date();
            $cookies.put(lastSyncTag, currentDate);
        };

        this.getLastSyncCompleted = function () {
            var lastSyncCompleted = $cookies.get(lastSyncTag);
            return new Date(lastSyncCompleted);
        };
    }]);
