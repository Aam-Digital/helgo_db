'use strict';

angular.module('myApp.search', [
  'ui.bootstrap',
])

.directive('search', [function() {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            itemFormater: '=',
            itemExecute: '=',
        },
        templateUrl: 'components/search/search.html',

        link: function(scope, element, attrs) {
            scope.label = function(item) {
                if(item !== undefined) {
                    return scope.itemFormater(item);
                }
            }
            scope.searchExecute = function(item, model, label) {
                if(item) {
                    scope.itemExecute(item);
                }
            };
        },
    };
}]);
