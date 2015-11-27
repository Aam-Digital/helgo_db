'use strict';

/**
 * @ngdoc directive
 * @name hdbApp.directive:search
 * @description
 * # search
 */
angular.module('hdbApp')
    .directive('search', [function () {
        return {
            restrict: 'E',
            scope: {
                items: '=',
                itemExecute: '=',
            },
            templateUrl: 'views/search.html',

            link: function (scope, element, attrs) {
                scope.searchExecute = function (item, model, label) {
                    if (item) {
                        scope.itemExecute(item);
                    }
                };
            },
        };
    }]);
