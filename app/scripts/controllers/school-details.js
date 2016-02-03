'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:SchoolDetailsCtrl
 * @description
 * # SchoolDetailsCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('SchoolDetailsCtrl', ['$scope', '$location', '$filter', '$routeParams', '$log', 'ngTableParams', 'schoolManager', 'School', 'childManager', '$timeout',
        function ($scope, $location, $filter, $routeParams, $log, ngTableParams, schoolManager, School, childManager, $timeout) {

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
                                count: 25
                            },
                            {
                                getData: function ($defer, params) {
                                    childManager.getStudentsOfSchool(school).then(
                                        function (data) {
                                            $scope.items = data;
                                            params.total(data.length);
                                            $defer.resolve($filter('orderBy')(data, params.orderBy()));
                                        }
                                    );
                                }
                            }
                        );
                    },
                    function (err) {
                        $scope.error = "The given school could not be loaded.";
                        $log.error(err);
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

                $scope.savedMsg = true;
                $timeout(function () {
                    $scope.savedMsg = false;
                }, 3000);
            };

            $scope.showChild = function (pn) {
                $location.path("/child/" + pn);
            };

            $scope.cancel = function () {
                schoolManager.uncache(param);
                $scope.school = {};
                $location.path("/school");
            }

        }]);
