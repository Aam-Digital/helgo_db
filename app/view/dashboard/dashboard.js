'use strict';

angular.module('myApp.view.dashboard', [
    'ngRoute',
    'myApp.child',
])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'view/dashboard/dashboard.html',
                controller: 'DashboardController'
            });
    }])

    .controller('DashboardController', ['$scope', function($scope) {

    }]);
