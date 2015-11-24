angular.module('myApp.navigation', [
    'myApp.user',
])

    .controller('NavigationController', ['$scope', 'userManager', function ($scope, userManager) {
    $scope.menu_main = [
        { url: '/', icon: 'fa-home', title: 'Overview', },
        { url: '/child', icon: 'fa-child', title: 'Children', },
        { url: '/school', icon: 'fa-university', title: 'Schools',},
    ];

        $scope.$watch(
            function () {
                return userManager.isLoggedIn();
            },
            function (value) {
                $scope.loggedIn = value;
            }
        );
}]);