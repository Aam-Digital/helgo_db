'use strict';

/**
 * @ngdoc directive
 * @name hdbApp.directive:searchChild
 * @description
 * # searchChild
 */
angular.module('hdbApp')
    .directive('searchChild', ['$location', 'childManager', function ($location, childManager) {
        return {
            restrict: 'E',
            template: '<search items="children" item-execute="openChild"></search>',

            link: function (scope, element, attrs) {
                childManager.getAll().then(function (data) {
                    scope.children = data;
                    scope.openChild = function (child) {
                        $location.path("/child/" + child.pn);
                    };
                });
            },
        };
    }]);
