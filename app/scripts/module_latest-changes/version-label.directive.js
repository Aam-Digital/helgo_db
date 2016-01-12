'use strict';

/**
 * @ngdoc directive
 * @name hdbApp.directive:versionLabel
 * @description
 * # versionLabel
 * Displays the current version of the app and links to details about latest changes.
 */
angular.module('hdbApp.latestChanges')
    .directive('versionLabel', ['changelog', 'latestChanges', function (changelog, latestChanges) {
        return {
            restrict: 'E',
            scope: {},
            template: '<a style="cursor:pointer;" ng-click="showLatestChanges();">{{ version }}</a>',

            link: function (scope, element, attrs) {
                scope.showLatestChanges = latestChanges.show;
                changelog.getCurrentReleaseDetails().then(function(release) {
                    scope.version = release.tag_name;
                });
            },
        };
    }]);
