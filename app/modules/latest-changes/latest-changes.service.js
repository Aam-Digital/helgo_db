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


        function checkLatestVersion(lastKnownVersion) {
            changelog.getCurrentReleaseDetails().then(function(release) {
                if (release.version != lastKnownVersion) {
                    showLatestChanges();
                }
            });
        };

        function showLatestChanges() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/latest-changes/latest-changes.html',
                controller: 'LatestChangesCtrl',
            });
        };
    }]);
