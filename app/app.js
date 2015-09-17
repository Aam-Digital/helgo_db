'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view.dashboard',
  'myApp.view.child',
  'myApp.version',
  'myApp.navigation',
  'myApp.alerts',
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);



angular.module('myApp.version', [
  'myApp.version.version-directive',
])

.value('version', '0.1');
