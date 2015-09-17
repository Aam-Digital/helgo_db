
angular.module('myApp.alerts', [])

.controller('AlertController', ['$scope', function($scope) {
    $scope.alerts = [
        { title: 'Homevisit Raja', time: 'today', },
        { title: 'Software Update', time: '10 days ago', },
    ];
}]);
