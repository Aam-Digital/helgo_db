'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'myApp.config',
    'ngRoute',
    'myApp.appDB',
    'myApp.view.dashboard',
    'myApp.view.child',
    'myApp.view.login',
    'myApp.view.user',
    'version',
    'myApp.navigation',
    'myApp.alerts',
    'myApp.child',
    'myApp.user',
    'myApp.school',
    'myApp.view.school',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .run(['$rootScope', '$location', '$log', 'userManager', function ($rootScope, $location, $log, userManager) {
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = (['/login', '/register'].indexOf($location.path()) === -1);
            if (restrictedPage && !userManager.isLoggedIn()) {
                $location.path('/login');
            }
        });
    }]);


String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};