'use strict';

angular.module('myApp.view.child', [
    'ngRoute',
    'ngTable',
    'ui.bootstrap',
    'myApp.search',
    'myApp.school',
    'myApp.view.school',
    'myApp.user',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/child', {
                templateUrl: 'view/child/child-list.html',
                controller: 'ChildListController'
            })
            .when('/child/:pn', {
                templateUrl: 'view/child/child-details.html',
                controller: 'ChildDetailsController'
            });
    }])

    .directive('searchChild', ['$location', 'childrenManager', function($location, childrenManager) {
        return {
            restrict: 'E',
            template: '<search items="children" item-execute="openChild"></search>',

            link: function(scope, element, attrs) {
                childrenManager.getAll().then(function(data) {
                    scope.children = data;
                    scope.openChild = function(child) {
                        $location.path("/child/" + child.pn);
                    };
                });
            },
        };
    }])


    .controller('ChildListController', ['$scope', '$location', '$filter', '$log', 'ngTableParams', 'Child', 'childrenManager', function ($scope, $location, $filter, $log, ngTableParams, Child, childrenManager) {
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
                            $defer.resolve($filter('orderBy')(data, params.orderBy()));
                        },
                        $log.error);
                },
            }
        );

        $scope.showChild = function (pn) {
            $location.path("/child/" + pn);
        };
    }])


    .controller('ChildDetailsController', ['$scope', '$location', '$log', '$routeParams', 'ngTableParams', 'childrenManager', 'Child', 'userManager', 'schoolManager',
        function ($scope, $location, $log, $routeParams, ngTableParams, childrenManager, Child, userManager, schoolManager) {
            var param = $routeParams.pn;
            if (param === "new") {
                $scope.child = {};
                $scope.new = true;
            }
            else {
                childrenManager.get(param).then(
                    function (child) {
                        $scope.child = child;

                        $scope.tableFamily = new ngTableParams(
                            {
                                count: 25,
                            },
                            {
                                getData: function ($defer, params) {
                                    var data = [];
                                    $scope.items = data;
                                    params.total(data.length);
                                    $defer.resolve(data);
                                },
                            }
                        );

                        $scope.tableCoaching = new ngTableParams(
                            {
                                count: 25,
                            },
                            {
                                getData: function ($defer, params) {
                                    var data = [];
                                    $scope.items = data;
                                    params.total(data.length);
                                    $defer.resolve(data);
                                },
                            }
                        );

                        $scope.showFamilyMember = function (familyMemberId) {
                            $location.path("/child/" + pn + "/family/" + familyMemberId);
                        };
                    },
                    function (err) {
                        $scope.error = "The given child could not be loaded.";

                        $scope.child = {};
                        $scope.new = true;
                    }
                );
            }


            $scope.save = function () {
                var child = $scope.child;
                if ($scope.new) {
                    child = new Child(child);
                }
                child.update();
            };


            userManager.getAllSocialworkers().then(function (users) {
                $scope.socialworkers = users;
            });

            $scope.centers = ['Tikiapara', 'Liluah'];

            schoolManager.getAll().then(function (schools) {
                $scope.schools = schools;
            });

        }]);
;

