'use strict';

/**
 * @ngdoc directive
 * @name hdbApp.directive:versionLabel
 * @description
 * # versionLabel
 * Displays the current version of the app and links to details about latest changes.
 */
angular.module('hdbApp')
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
    }]);
