'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * Main module of the application.
 */
angular
    .module('hdbApp', [
        'ngRoute',
        'ngSanitize',
        'ngTable',
        'ui.bootstrap',
        'pouchdb'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
            })
            .when('/login', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl',
            })
            .when('/logout', {
                templateUrl: 'views/login.html',
                controller: 'LogoutCtrl'
            })
            .when('/user', {
                templateUrl: 'views/user-account.html',
                controller: 'UserAccountCtrl',
            })
            .when('/school', {
              templateUrl: 'views/school-list.html',
              controller: 'SchoolListCtrl',
            })
            .when('/school/:name', {
              templateUrl: 'views/school-details.html',
              controller: 'SchoolDetailsCtrl',
            })
            .when('/child', {
              templateUrl: 'views/child-list.html',
              controller: 'ChildListCtrl',
            })
            .when('/child/:pn', {
              templateUrl: 'views/child-details.html',
              controller: 'ChildDetailsCtrl',
            })
            .otherwise({redirectTo: '/'});
    }])

    .run(['$rootScope', '$location', '$log', 'userManager', function ($rootScope, $location, $log, userManager) {
        $rootScope.$on('$locationChangeStart', function (/*event, next, current*/) {
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