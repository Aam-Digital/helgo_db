'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:SchoolListCtrl
 * @description
 * # SchoolListCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('SchoolListCtrl', ['$scope', '$location', '$filter', '$log', 'ngTableParams', 'schoolManager', 'pagination', function ($scope, $location, $filter, $log, ngTableParams, schoolManager, pagination) {
        $scope.tableParams = new ngTableParams(
            {
                page: 1, // initial paginated page to show
                count: 25 // number of rows to show
            },
            {
                getData: function ($defer, params) {
                    schoolManager.getAll().then(
                        function (data) {
                            $scope.count = data.length;
                            $defer.resolve(pagination.paginate(params, data));
                        },
                        $log.error);
                },
            }
        );

        $scope.show = function (name) {
            $location.path("/school/" + name);
        };
    }]);
