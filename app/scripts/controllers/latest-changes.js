'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LatestChangesCtrl
 * @description
 * # LatestChangesCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LatestChangesCtrl', function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };
    });
