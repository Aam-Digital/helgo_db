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
        var alerts = [];
        return {
            alerts: alerts,
            ALERT_SUCCESS: 'success',
            ALERT_DANGER: 'danger',
            ALERT_WARNING: 'warning',
            addAlert: addAlert,
            removeAlert: removeAlert
        }
        function addAlert(message, type) {
            alerts.push({type: type, msg: message});
        }
        function removeAlert(index) {
            alerts.splice(index, 1);
        }
  }]);
