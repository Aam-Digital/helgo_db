'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.app-menu',
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}])

.controller('MenuController', ['$scope', function($scope) {
    $scope.menu_main = [
        { url: 'view1', title: 'View 1', },
        { url: 'view2', title: 'View 2', },
    ];
}]);

