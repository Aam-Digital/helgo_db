'use strict';

angular.module('myApp.view.school', [
    'ngRoute',
    'ngTable',
    'ui.bootstrap',
    'myApp.search',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/school', {
                templateUrl: 'view/school/school-list.html',
                controller: 'SchoolListController'
            })
            .when('/school/:name', {
                templateUrl: 'view/school/school-details.html',
                controller: 'SchoolDetailsController'
            });
    }])

    .directive('searchSchool', ['$location', 'schoolManager', function ($location, schoolManager) {
        return {
            restrict: 'E',
            scope: {
                itemExecute: '=',
            },
            template: '<search items="schools" item-execute="itemExecute"></search>',

            link: function (scope, element, attrs) {
                schoolManager.getAll().then(function (data) {
                    scope.schools = data;
                    if (!scope.itemExecute) {
                        scope.itemExecute = function (item) {
                            $location.path("/school/" + item.name);
                        };
                    }
                    ;
                });
            },
        };
    }])


    .controller('SchoolListController', ['$scope', '$location', '$log', 'ngTableParams', 'schoolManager', function ($scope, $location, $log, ngTableParams, schoolManager) {
        $scope.tableParams = new ngTableParams(
            {
                count: 25,
            },
            {
                getData: function ($defer, params) {
                    schoolManager.getAll().then(
                        function (data) {
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve(data);
                        },
                        $log.error);
                },
            }
        );

        $scope.show = function (name) {
            $location.path("/school/" + name);
        };
    }])


    .controller('SchoolDetailsController', ['$scope', '$location', '$routeParams', '$log', 'ngTableParams', 'schoolManager', 'childrenManager',
        function ($scope, $location, $routeParams, $log, ngTableParams, schoolManager, childrenManager) {

            console.log($routeParams);
            schoolManager.get($routeParams.name).then(function (school) {
                $scope.school = school;
            });


            $scope.tableStudents = new ngTableParams(
                {
                    count: 25,
                },
                {
                    getData: function ($defer, params) {
                        childrenManager.getAll().then(function (data) {
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve(data);
                        });
                    },
                }
            );
            $scope.showChild = function (pn) {
                $location.path("/child/" + pn);
            };

        }]);
