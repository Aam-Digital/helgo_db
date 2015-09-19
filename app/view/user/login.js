'use strict';

angular.module('myApp.user', [
    'ngRoute',
    'myApp.appDB',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'view/user/login.html',
                controller: 'LoginController'
            })
            .when('/logout', {
                templateUrl: 'view/user/login.html',
                controller: 'LogoutController'
            });
    }])

    .controller('LoginController', ['$scope', '$location', 'appDB', function ($scope, $location, appDB) {
        $scope.login = function login() {
            appDB.login($scope.user.name, $scope.user.password).then(
                function (status) {
                    if (status.ok) {
                        $location.path("/");
                    }
                    else {
                        $scope.error = status.info.message;
                    }
                });
        };
    }])

    .controller('LogoutController', ['$location', 'appDB', function ($location, appDB) {
        appDB.logout();

        $location.path("/login");
    }]);

