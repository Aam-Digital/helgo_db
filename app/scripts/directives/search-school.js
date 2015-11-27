'use strict';

/**
 * @ngdoc directive
 * @name hdbApp.directive:searchSchool
 * @description
 * # searchSchool
 */
angular.module('hdbApp')
    .directive('searchSchool', ['$location', 'schoolManager', function ($location, schoolManager) {
        return {
            restrict: 'E',
            scope: {
                itemExecute: '=',
            },
            template: '<search items="schools" item-execute="itemExecute"></search>',

            link: function (scope, element, attrs) {
                schoolManager.getAll().then(function (data) {
                    scope.schools = data;
                    if (!scope.itemExecute) {
                        scope.itemExecute = function (item) {
                            $location.path("/school/" + item.name);
                        };
                    }
                    ;
                });
            },
        };
    }]);
