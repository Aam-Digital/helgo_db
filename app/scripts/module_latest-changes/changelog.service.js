'use strict';

/**
 * @ngdoc service
 * @name changelog
 * @description
 * # changelog
 * Reads and returns the 'changelog.json' file in the root directory.
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
