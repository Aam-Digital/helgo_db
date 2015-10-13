angular.module('version', [
    'ui.bootstrap',
    'ngSanitize',
])


    .factory('latestChanges', ['$q', '$http', '$log', '$rootScope', '$modal', 'appConfig', function ($q, $http, $log, $rootScope, $modal, appConfig) {
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
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'components/version/changes-modal.html',
                        controller: 'ChangesModalController',
                    });
                },
                function (err) {
                    $log.error("Could not load release information from GitHub.")
                }
            );
        };

        return latestChanges;
    }])


    .directive('versionLabel', ['appConfig', 'latestChanges', function (appConfig, latestChanges) {
        return {
            restrict: 'E',
            scope: {},
            template: '<a style="cursor:pointer;" ng-click="showLatestChanges();">v{{ info.version }}</a>',

            link: function (scope, element, attrs) {
                scope.info = appConfig;
                scope.showLatestChanges = latestChanges.check;
            },
        };
    }])


    .filter('newlines', function() {
        return function (text) {
            return text.replace(/\n/g, '<br/>');
        };
    })


    .controller('ChangesModalController', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };
    });