'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LogoutCtrl', ['$location', 'userManager', function ($location, userManager) {
        userManager.logout();
        $location.path("/login");
    }]);
