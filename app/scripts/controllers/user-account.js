'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:UserAccountCtrl
 * @description
 * # UserAccountCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('UserAccountCtrl', ['$scope', '$log', 'alertManager', 'userManager', function ($scope, $log, alertManager, userManager) {
        $scope.user = userManager.getCurrentUser();
        $scope.save = function () {
            $scope.user.update();
        };

        $scope.changePassword = function () {
            if (!$scope.formPasswordChange.$valid) {
                return;
            }
            if ($scope.newPassword == "" || $scope.newPassword != $scope.newPassword2) {
                alertManager.addAlert("The password in the new password and the verification field must be identical.", alertManager.ALERT_WARNING);
                return;
            }

            userManager.changePassword($scope.user, $scope.newPassword).then(
                function () {
                    alertManager.addAlert("Password sucessfully changed", alertManager.ALERT_SUCCESS);
                },
                function (err) {
                    alertManager.addAlert("Could not change the password: " + err.message, alertManager.ALERT_DANGER);
                    $log.error("Failed to change password: " + err);
                }
            );
        };
    }]);
