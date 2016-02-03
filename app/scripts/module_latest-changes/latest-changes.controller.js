'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LatestChangesCtrl
 * @description
 * # LatestChangesCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp.latestChanges')
    .controller('LatestChangesCtrl', ['$scope', '$uibModalInstance', 'changelog', function ($scope, $uibModalInstance, changelog) {
        $scope.ok = $uibModalInstance.close;
        changelog.getCurrentReleaseDetails().then(function(release) {
            $scope.release = release;
        });
    }]);
