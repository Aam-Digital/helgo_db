'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:UserAccountCtrl
 * @description
 * # UserAccountCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('UserAccountCtrl', ['$scope', '$log', 'userManager', function ($scope, $log, userManager) {
        $scope.user = userManager.getCurrentUser();
        $scope.save = function () {
            $scope.user.update();
        };

        $scope.changePassword = function () {
            if (!$scope.formPasswordChange.$valid) {
                return;
            }
            if ($scope.newPassword == "" || $scope.newPassword != $scope.newPassword2) {
                alert("The password in the new password and the verification field must be identical.");
                return;
            }

            userManager.changePassword($scope.user, $scope.newPassword).then(
                function () {
                    alert("Password sucessfully changed");
                },
                function (err) {
                    alert("Could not change the password. Please check the error log or try again.");
                    $log.error("Failed to change password: " + err);
                }
            );
        };
    }]);
