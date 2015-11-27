'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LoginCtrl', ['$scope', '$location', 'userManager', function ($scope, $location, userManager) {

        console.log("ctrl");

        $scope.login = function login() {
            console.log("fn");

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
    }]);
