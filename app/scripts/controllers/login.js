'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LoginCtrl', ['$scope', '$location', '$log', 'userManager', 'appDB', function ($scope, $location, $log, userManager, appDB) {

        console.log("ctrl");

        $scope.login = function login() {
            console.log("fn");

            userManager.login($scope.user.name, $scope.user.password).then(
                function (status) {
                    if (status.ok) {
                        $log.debug("Login success");
                        appDB.login($scope.user.name, $scope.user.password).then(
                            function () {
                                appDB.sync();
                            }
                        );
                        $location.path("/");
                    } else {
                        _loginFailed($scope, $log, userManager, $location, appDB, $scope.user.name, $scope.user.password);
                    }
                }, function (err) {
                    _loginFailed($scope, userManager, $location, $log, appDB, $scope.user.name, $scope.user.password);
                }
            );

        };
    }]);

function _loginFailed(scope, userManager, location, log, appDB, user, password) {
    log.debug("Login failed");

    appDB.login(user, password).then(
        function () {
            log.debug("Trying to sync...");
            appDB.sync().then(
                function () {
                    userManager.login(user, password).then(
                        function (status) {
                            if (status.ok) {
                                log.debug("Second login successful");
                                location.path("/");
                                appDB.syncLive();
                            }
                            else {
                                scope.error = status.message;
                            }
                        },
                        function (err) {
                            scope.error = err.message;
                        }
                    )
                },
                function (err) {
                    scope.error = err.message;
                }
            )
        },
        function (err) {
            scope.error = err.message;
        }
    );
}
