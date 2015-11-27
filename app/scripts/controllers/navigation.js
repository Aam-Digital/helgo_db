'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:NavigationCtrl
 * @description
 * Main navigation menu controller.
 */
angular.module('hdbApp')
    .controller('NavigationCtrl', ['$scope', 'userManager', function ($scope, userManager) {
        $scope.menu_main = [
            {url: '/', icon: 'fa-home', title: 'Overview',},
            {url: '/child', icon: 'fa-child', title: 'Children',},
            {url: '/school', icon: 'fa-university', title: 'Schools',},
        ];

        $scope.$watch(
            function () {
                return userManager.isLoggedIn();
            },
            function (value) {
                $scope.loggedIn = value;
            }
        );
    }]);
