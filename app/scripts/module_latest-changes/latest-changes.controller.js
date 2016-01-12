'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LatestChangesCtrl
 * @description
 * # LatestChangesCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp.latestChanges')
    .controller('LatestChangesCtrl', ['$scope', '$modalInstance', 'changelog', function ($scope, $modalInstance, changelog) {
        $scope.ok = $modalInstance.close;
        changelog.getCurrentReleaseDetails().then(function(release) {
            $scope.release = release;
        });
    }]);
