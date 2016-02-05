'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:FamilymemberCtrl
 * @description
 * # FamilymemberCtrl
 * Controller of the FamilyMember details of a Child (displayed as a Modal)
 */
angular.module('hdbApp')
    .controller('FamilymemberCtrl', ['$scope', '$log', '$uibModalInstance', 'FamilyMember', function ($scope, $log, $uibModalInstance, FamilyMember) {
        if ($scope.selectedFamilyMember === "new") {
            $scope.selectedFamilyMember = {};
            $scope.newFamilyMember = true;
        }

        $scope.saveFamilyMember = function () {
            if (!$scope.formUpdateFamilyMember.$valid) {
                return;
            }

            if ($scope.newFamilyMember) {
                $scope.selectedFamilyMember = new FamilyMember($scope.selectedFamilyMember, $scope.selectedChild);

                $scope.selectedChild.familyMembers.push($scope.selectedFamilyMember._id);
                $scope.selectedChild.update();
            }
            $scope.selectedFamilyMember.update().then(
                function () {
                },
                function (err) {
                    $log.error("Error saving family member (" + $scope.selectedFamilyMember._id + "): " + err.message);
                }
            );
            $uibModalInstance.close();
        };

        $scope.deleteFamilyMember = function () {
            for (var i = 0; i < $scope.selectedChild.familyMembers.length; i++) {
                if ($scope.selectedChild.familyMembers[i] == $scope.selectedFamilyMember._id) {
                    $scope.selectedChild.familyMembers.splice(i, 1);
                    break;
                }
            }
            $scope.selectedChild.update();

            $scope.selectedFamilyMember.delete();

            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
