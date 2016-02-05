'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:EnrollmentCtrl
 * @description
 * # EnrollmentCtrl
 * Controller of the enrollment details of a Child (displayed as a Modal)
 */
angular.module('hdbApp')
    .controller('EnrollmentCtrl', ['$scope', '$uibModalInstance', 'schoolManager', 'Enrollment', function ($scope, $uibModalInstance, schoolManager, Enrollment) {
        if ($scope.selectedEnrollment === "new") {
            $scope.selectedEnrollment = {};
            $scope.newEnrollment = true;
        }

        $scope.saveEnrollment = function () {
            //TODO: confirm

            $scope.selectedEnrollment.child = $scope.selectedChild._id;
            if ($scope.newEnrollment) {
                $scope.selectedEnrollment = new Enrollment($scope.selectedEnrollment);
            }

            $scope.selectedEnrollment.update();
            $uibModalInstance.close();
        };

        $scope.deleteEnrollment = function () {
            //TODO: confirm

            $scope.selectedEnrollment.delete();
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };


        schoolManager.getAll().then(function (schools) {
            $scope.schools = schools;
        });
    }]);
