'use strict';

angular.module('myApp.view.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'view/dashboard/dashboard.html',
            controller: 'DashboardController'
        });
}])

.controller('DashboardController', [function() {

}]);
