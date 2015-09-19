'use strict';
var DB_REMOTE = "http://185.101.92.214:5984"; 

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.appDB',
    'myApp.view.dashboard',
    'myApp.view.child',
    'myApp.version',
    'myApp.navigation',
    'myApp.alerts',
    'myApp.child',
    'myApp.user',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .run(['$rootScope', '$location', '$log', 'appDB', function ($rootScope, $location, $log, appDB) {
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            if (restrictedPage && !appDB.isLoggedIn()) {
                $location.path('/login');
            }
        });
    }]);


angular.module('myApp.version', [
    'myApp.version.version-directive',
])

    .value('version', '0.1');
