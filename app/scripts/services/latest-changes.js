'use strict';

/**
 * @ngdoc service
 * @name hdbApp.latestChanges
 * @description
 * # latestChanges
 * Provides details about the current app version's latest changes.
 */
angular.module('hdbApp')
    .factory('latestChanges', ['$q', '$http', '$log', '$rootScope', '$uibModal', 'appConfig', function ($q, $http, $log, $rootScope, $uibModal, appConfig) {
        var latestChanges = {};

        latestChanges.check = function (lastKnownVersion) {
            if (appConfig.version != lastKnownVersion) {
                latestChanges.show();
            }
        };

        latestChanges.show = function () {
            $http.get('https://api.github.com/repos/' + appConfig.github.user + '/' + appConfig.github.repository + '/releases/latest').then(
                function (githubRelease) {
                    $rootScope.release = githubRelease.data;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'views/latest-changes.html',
                        controller: 'LatestChangesCtrl'
                    });
                },
                function (err) {
                    $log.error("Could not load release information from GitHub.")
                }
            );
        };

        return latestChanges;
    }]);
