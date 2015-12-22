'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:ChildListCtrl
 * @description
 * # ChildListCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('ChildListCtrl', ['$scope', '$location', '$filter', '$log', 'ngTableParams', 'Child', 'childManager', 'pagination', function ($scope, $location, $filter, $log, ngTableParams, Child, childManager, pagination) {
        $scope.tableParams = new ngTableParams(
            {
                page: 1, // initial paginated page to show
                count: 25 // number of rows to show
            },
            {
                getData: function ($defer, params) {
                    childManager.getAll().then(
                        function (data) {
                            pagination.paginate($defer, params, $scope, data);
                        },
                        $log.error);
                },
            }
        );

        $scope.showChild = function (pn) {
            $location.path("/child/" + pn);
        };
    }]);
