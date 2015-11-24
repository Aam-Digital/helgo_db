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


    .controller('SchoolListController', ['$scope', '$location', '$filter', '$log', 'ngTableParams', 'schoolManager', function ($scope, $location, $filter, $log, ngTableParams, schoolManager) {
        $scope.tableParams = new ngTableParams(
            {
                page: 1, // initial paginated page to show
                count: 5 // number of rows to show
            },
            {
                counts: [5,10,20], // this here if left empty leads to the default size of pagination.
                getData: function ($defer, params) {
                    schoolManager.getAll().then(
                        function (data) {
                            params.total(data.length);
                            $scope.items = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($filter('orderBy')($scope.items, params.orderBy()));
                        },
                        $log.error);
                },
            }
        );

        $scope.show = function (name) {
            $location.path("/school/" + name);
        };
    }])


    .controller('SchoolDetailsController', ['$scope', '$location', '$filter', '$routeParams', '$log', 'ngTableParams', 'schoolManager', 'School', 'childrenManager',
        function ($scope, $location, $filter, $routeParams, $log, ngTableParams, schoolManager, School, childrenManager) {

            var param = $routeParams.name;
            if (param === "new") {
                $scope.school = {};
                $scope.new = true;
            }
            else {
                schoolManager.get(param).then(
                    function (school) {
                        $scope.school = school;

                        $scope.tableStudents = new ngTableParams(
                            {
                                count: 25,
                            },
                            {
                                getData: function ($defer, params) {
                                    childrenManager.getStudentsOfSchool(school).then(
                                        function(data) {
                                            $scope.items = data;
                                            params.total(data.length);
                                            $defer.resolve($filter('orderBy')(data, params.orderBy()));
                                        }
                                    );
                                },
                            }
                        );
                    },
                    function (err) {
                        $scope.error = "The given school could not be loaded.";

                        $scope.school = {};
                        $scope.new = true;
                    }
                );
            }


            $scope.save = function () {
                var school = $scope.school;
                if ($scope.new) {
                    school = new School(school);
                }
                school.update();
            };
            $scope.showChild = function (pn) {
                $location.path("/child/" + pn);
            };

        }]);
