'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * Main module of the application.
 */
angular
    .module('hdbApp', [
        'ngRoute',
        'ngCookies',
        'ngSanitize',
        'ngTable',
        'ui.bootstrap',
        'pouchdb',
        'angulartics',
        'angulartics.piwik'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
            })
            .when('/logout', {
                templateUrl: 'views/login.html',
                controller: 'LogoutCtrl'
            })
            .when('/user', {
                templateUrl: 'views/user-account.html',
                controller: 'UserAccountCtrl',
            })
            .when('/school', {
                templateUrl: 'views/school-list.html',
                controller: 'SchoolListCtrl',
            })
            .when('/school/:name', {
                templateUrl: 'views/school-details.html',
                controller: 'SchoolDetailsCtrl',
            })
            .when('/child', {
                templateUrl: 'views/child-list.html',
                controller: 'ChildListCtrl',
            })
            .when('/child/:pn', {
                templateUrl: 'views/child-details.html',
                controller: 'ChildDetailsCtrl',
            })
            .otherwise({redirectTo: '/'});
    }])

    .run(['$rootScope', '$location', '$log', 'userManager', '$window', 'appConfig', function ($rootScope, $location, $log, userManager, $window, appConfig) {
        $rootScope.$on('$locationChangeStart', preventUnauthorizedAccess);
        if (appConfig.analytics.enabled) {
            setupPiwikAnalytics();
        }


        function preventUnauthorizedAccess() {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = (['/login', '/register'].indexOf($location.path()) === -1);
            if (restrictedPage && !userManager.isLoggedIn()) {
                $location.path('/login');
            }
        }

        function setupPiwikAnalytics() {
            $window._paq = $window._paq || [];
            //_paq.push(['trackPageView']); //automatically handled by angulartics
            $window._paq.push(['enableLinkTracking']);
            (function () {
                var u = appConfig.analytics.piwik_url;
                $window._paq.push(['setTrackerUrl', u + 'piwik.php']);
                $window._paq.push(['setSiteId', appConfig.analytics.site_id]);
                var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.async = true;
                g.defer = true;
                g.src = u + 'piwik.js';
                s.parentNode.insertBefore(g, s);
            })();
        }
    }]);


String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};
