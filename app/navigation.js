
angular.module('myApp.navigation', [])

.controller('NavigationController', ['$scope', function($scope) {
    $scope.menu_main = [
        { url: '#', icon: 'fa-home', title: 'Dashboard', },
        { url: '#/child', icon: 'fa-child', title: 'Children', },
        { url: '', icon: 'fa-sitemap', title: 'More', submenu: [
            { url: 'view1', title: 'Sub 1', },
            { url: 'view1', title: 'Sub 2', },
        ]},
    ];
}]);

angular.element(document).ready(function () {
    // trigger metisMenu again after ng-repeat directives of the menu are completed
    $('#side-menu').metisMenu();
});
