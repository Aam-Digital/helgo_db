'use strict';
var DB_REMOTE = "http://185.101.92.214:5984"; 

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.view.dashboard',
    'myApp.view.child',
    'myApp.version',
    'myApp.navigation',
    'myApp.alerts',
    'myApp.child',
    'pouchdb'
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]);


angular.module('myApp.version', [
    'myApp.version.version-directive',
])

    .value('version', '0.1');
