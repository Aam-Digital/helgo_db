'use strict';

/**
 * @ngdoc service
 * @name hdbApp.appConfig
 * @description
 * # appConfig
 * The custom app settings.
 */
angular.module('hdbApp.latestChanges')
    .factory('changelog', ['$http', '$q', '$log', function ($http, $q, $log) {
        return {
           getCurrentReleaseDetails: getCurrentReleaseDetails
        };


        function getCurrentReleaseDetails() {
            var deferred = $q.defer();

            $http.get('changelog.json').then(
                function(result) {
                    deferred.resolve(result.data[0]);
                },
                function(err) {
                    $log.error("Failed to load changlog.json");
                    deferred.reject();
                }
            );

            return deferred.promise;
        }
    }]);
