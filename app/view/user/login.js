'use strict';

angular.module('myApp.view.login', [
    'ngRoute',
    'myApp.user',
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

    .controller('LoginController', ['$scope', '$location', 'userManager', function ($scope, $location, userManager) {
        $scope.login = function login() {
            userManager.login($scope.user.name, $scope.user.password).then(
                function (status) {
                    if (status.ok) {
                        $location.path("/");
                    }
                    else {
                        $scope.error = status.message;
                    }
                },
                function (err) {
                    $scope.error = err.message;
                }
            );
        };
    }])

    .controller('LogoutController', ['$location', 'appDB', function ($location, appDB) {
        appDB.logout();

        $location.path("/login");
    }]);

