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
        $scope.getDismissTimeout = getDismissTimeout;
        $scope.closeAlert = function (index) {
            alertManager.removeAlert(index);
        };


        function getDismissTimeout(type) {
            switch (type) {
                case 'success':
                    return 3000;
                case 'warning':
                    return 5000;
                default:
                    return false;
            }
        }
    }]);
