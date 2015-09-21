'use strict';

angular.module('myApp.view.child', [
    'ngRoute',
    'ngTable',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/child', {
                templateUrl: 'view/child/child-list.html',
                controller: 'ChildListController'
            })
            .when('/child/:pn', {
                templateUrl: 'view/child/child-list.html',
                controller: 'ChildListController'
            });
    }])

    .controller('ChildListController', ['$scope', '$location', '$log', 'ngTableParams', 'Child', 'childrenManager', function ($scope, $location, $log, ngTableParams, Child, childrenManager) {

        $scope.tableParams = new ngTableParams(
            {
                count: 25,
            },
            {
                getData: function ($defer, params) {
                    childrenManager.getAll().then(
                        function (data) {
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve(data);
                        },
                        $log.error);
                },
            }
        );

        $scope.showChild = function (pn) {
            $location.path("/child/" + pn);
        };
    }]);

