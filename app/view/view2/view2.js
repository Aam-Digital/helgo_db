'use strict';

angular.module('myApp.view.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/child', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
}])

.controller('View2Ctrl', [function() {

}]);
