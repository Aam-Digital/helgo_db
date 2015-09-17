'use strict';

angular.module('myApp.view.child', ['ngRoute', 'ngTable'])

.config(['$routeProvider', function($routeProvider) {
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

.controller('ChildListController', ['$scope', '$location', 'ngTableParams', function($scope, $location, ngTableParams) {
    var myData = [
        {pn: '187', name: "Raja", center: 'Tikiapara', grade:'2', socialworker: 'Anjan'},
        {pn: '201', name: "Rohit", center: 'Liluah', grade:'1', socialworker: 'Anjan'},
        {pn: '107', name: "Afsana", center: 'Tikiapara', grade:'7', socialworker: 'Jaya'},
    ];

    $scope.tableParams = new ngTableParams(
        {
            count: 25,
        },
        {
            data: myData,
        }
    );

    $scope.showChild = function ( pn ) {
        $location.path( "/child/"+pn );
    };
}]);
