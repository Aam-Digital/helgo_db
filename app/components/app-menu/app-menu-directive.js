
angular.module('myApp.app-menu', [])

.directive('appMenu', function() {
    return {
        restrict: 'E',
        scope: { items: '=' },
        templateUrl: 'components/app-menu/menu.html',
    };
});
