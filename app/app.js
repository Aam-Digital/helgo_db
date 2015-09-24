'use strict';
var DB_REMOTE = "https://hdb.sinnfragen.org/db";

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.appDB',
    'myApp.view.dashboard',
    'myApp.view.child',
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
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            if (restrictedPage && !userManager.isLoggedIn()) {
//                $location.path('/login');
            }
        });
    }]);
