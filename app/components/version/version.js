angular.module('version', [
    'ui.bootstrap',
    'ngSanitize',
])

    .factory('appInfo', ['$q', '$http', '$log', function ($q, $http, $log) {
        var deferred = $q.defer();

        $http.get('app-info.json').then(
            function (result) {
                deferred.resolve(result.data);
            },
            function (err) {
                $log.error("Could not load 'app-info.json'.")
                deferred.reject(err);
            }
        );

        return deferred.promise;
    }])


    .factory('latestChanges', ['$q', '$http', '$log', '$rootScope', '$modal', 'appInfo', function ($q, $http, $log, $rootScope, $modal, appInfo) {
        var latestChanges = {};

        latestChanges.check = function (lastKnownVersion) {
            appInfo.then(function (info) {
                if (info.version != lastKnownVersion) {
                    latestChanges.show();
                }
            });
        };

        latestChanges.show = function () {
            appInfo.then(function (localInfo) {
                $http.get('https://api.github.com/repos/' + localInfo.github.user + '/' + localInfo.github.repository + '/releases/latest').then(
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
            });
        };

        return latestChanges;
    }])


    .directive('versionLabel', ['appInfo', 'latestChanges', function (appInfo, latestChanges) {
        return {
            restrict: 'E',
            scope: {},
            template: '<a style="cursor:pointer;" ng-click="showLatestChanges();">v{{ info.version }}</a>',

            link: function (scope, element, attrs) {
                appInfo.then(function (info) {
                    scope.info = info;
                });

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