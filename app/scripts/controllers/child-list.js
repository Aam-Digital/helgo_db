'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:ChildListCtrl
 * @description
 * # ChildListCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('ChildListCtrl', ['$scope', '$location', '$filter', '$log', 'ngTableParams', 'Child', 'childManager', function ($scope, $location, $filter, $log, ngTableParams, Child, childManager) {
        $scope.tableParams = new ngTableParams(
            {
                page: 1, // initial paginated page to show
                count: 5 // number of rows to show
            },
            {
                counts: [5, 10, 20], // this here if left empty leads to the default size of pagination.
                getData: function ($defer, params) {
                    childManager.getAll().then(
                        function (data) {
                            params.total(data.length);
                            $scope.items = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($filter('orderBy')($scope.items, params.orderBy()));
                        },
                        $log.error);
                },
            }
        );

        $scope.showChild = function (pn) {
            $location.path("/child/" + pn);
        };
    }]);
