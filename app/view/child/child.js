'use strict';

angular.module('myApp.view.child', [
    'ngRoute',
    'ngTable',
    'pouchdb',
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
        createSampleChildren(Child);

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


function createSampleChildren(Child) {
    var b1 = new Child({pn: '187', name: "Raja", center: 'Tikiapara', grade: '2', socialworker: 'Anjan'});
    var b2 = new Child({pn: '201', name: "Rohit", center: 'Liluah', grade: '1', socialworker: 'Anjan'});
    var b3 = new Child({pn: '107', name: "Afsana", center: 'Tikiapara', grade: '7', socialworker: 'Jaya'});

    b1.update();
    b2.update();
    b3.update();
}