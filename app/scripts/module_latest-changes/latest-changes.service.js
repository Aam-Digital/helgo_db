'use strict';

/**
 * @ngdoc service
 * @name hdbApp.latestChanges
 * @description
 * # latestChanges
 * Provides details about the current app version's latest changes.
 */
angular.module('hdbApp.latestChanges')
    .factory('latestChanges', ['$q', '$http', '$log', '$rootScope', '$modal', 'changelog', function ($q, $http, $log, $rootScope, $modal, changelog) {
        return {
            check: checkLatestVersion,
            show: showLatestChanges
        };


        /**
         * Checks if the current version is more recent than the given lastKnownVersion and shows a modal displaying
         * the latest changes in that case.
         * @param lastKnownVersion The version last seen by the user which is to be compared with current version.
         * @returns {*} promise: false if there is no newer version; string of the latest version otherwise.
         */
        function checkLatestVersion(lastKnownVersion) {
            var deferred = $q.defer();

            changelog.getCurrentReleaseDetails().then(function (release) {
                if (release.tag_name != lastKnownVersion) {
                    showLatestChanges();
                    deferred.resolve(release.tag_name);
                } else {
                    deferred.resolve(false);
                }
            });

            return deferred.promise;
        }

        /**
         * Shows a modal displaying the latest changes of the most recent version.
         */
        function showLatestChanges() {
            $modal.open({
                animation: true,
                templateUrl: 'scripts/module_latest-changes/latest-changes.html',
                controller: 'LatestChangesCtrl'
            });
        }
    }]);
