
angular.module('myApp.navigation', [])

.controller('NavigationController', ['$scope', function($scope) {
    $scope.menu_main = [
        { url: '/', icon: 'fa-home', title: 'Overview', },
        { url: '/child', icon: 'fa-child', title: 'Children', },
        {url: '/school', icon: 'fa-university', title: 'Schools',},
        { url: '', icon: 'fa-sitemap', title: 'More', submenu: [
            { url: '/', title: 'Sub 1', },
            { url: '/', title: 'Sub 2', },
        ]},
    ];
}])



angular.element(document).ready(function () {
    // trigger metisMenu again after ng-repeat directives of the menu are completed
    $('#side-menu').metisMenu();
});
