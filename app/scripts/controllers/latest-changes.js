'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LatestChangesCtrl
 * @description
 * # LatestChangesCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LatestChangesCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }]);
