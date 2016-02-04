'use strict';

/**
 * @ngdoc service
 * @name hdbApp.alertManager
 * @description
 * # alertManager
 * Service in the hdbApp.
 */
angular.module('hdbApp')
    .service('alertManager', ['$timeout', function ($timeout) {
        var alerts = {};
        return {
            alerts: alerts,
            ALERT_SUCCESS: 'alert-success',
            ALERT_DANGER: 'alert-danger',
            addAlert: addAlert,
            addSuccess: addSuccess,
            addDanger: addDanger,
            addWarning: addWarning,
            removeAlert: removeAlert
        }
        function addAlert(message, type) {
            alerts[type] = alerts[type] || [];
            alerts[type].push(message);
        }
        function addSuccess(message) {
            addAlert(message, 'alert-success');
            // show success alert for 3 seconds
            $timeout(function () {
                removeAlert(message, 'alert-success');
            }, 3000);
        }
        function addDanger(message) {
            addAlert(message, 'alert-danger');
        }
        function addWarning(message) {
            addAlert(message, 'alert-warning');
            // show warning alert for 5 seconds
            $timeout(function () {
                removeAlert(message, 'alert-warning');
            }, 5000);
        }
        function removeAlert(message, type) {
            var index = alerts[type].indexOf(message);
            if (index > -1) {
                alerts[type].splice(index, 1);
            }
        }
  }]);
