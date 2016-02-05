'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:AlertCtrl
 * @description
 * # AlertCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
      .controller('AlertCtrl', ['$scope', 'alertManager', function ($scope, alertManager) {
            $scope.alerts = alertManager.alerts;

            $scope.closeAlert = function(index) {
                alertManager.removeAlert(index);
            }
      }]);
