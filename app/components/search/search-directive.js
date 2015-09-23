'use strict';

angular.module('myApp.search', [
  'ui.bootstrap',
])

.directive('search', [function() {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            itemExecute: '=',
        },
        templateUrl: 'components/search/search.html',

        link: function(scope, element, attrs) {
            scope.searchExecute = function(item, model, label) {
                if(item) {
                    scope.itemExecute(item);
                }
            };
        },
    };
}]);
