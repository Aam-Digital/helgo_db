'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:SchoolDetailsCtrl
 * @description
 * # SchoolDetailsCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('SchoolDetailsCtrl', ['$scope', '$location', '$filter', '$routeParams', '$log', 'ngTableParams', 'schoolManager', 'School', 'childManager', '$timeout', 'alertManager',
        function ($scope, $location, $filter, $routeParams, $log, ngTableParams, schoolManager, School, childManager, $timeout, alertManager) {

            var param = $routeParams.name;
            if (param === "new") {
                $scope.school = {};
                $scope.new = true;
                alertManager.addAlert('Creating a new school record.', alertManager.ALERT_SUCCESS);
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
                        alertManager.addAlert('The given school could not be loaded', alertManager.ALERT_DANGER);
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
                alertManager.addAlert('Saved changes', alertManager.ALERT_SUCCESS);
                $location.path("/school");
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
