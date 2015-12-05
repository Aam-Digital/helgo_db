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

        $scope.isLoginBtnDisabled = false;

        $scope.login = function login() {
            $scope.isLoginBtnDisabled = true;
            userManager.login($scope.user.name, $scope.user.password).then(
                function (status) {
                    if (status.ok) {
                        $log.debug("Login success");
                        appDB.login($scope.user.name, $scope.user.password).then(
                            function () {
                                appDB.syncLive();
                            }
                        );
                        $location.path("/");
                    } else {
                        _loginFailed();
                    }
                }, function (err) {
                    _loginFailed();
                }
            );

            function _loginFailed() {
                $log.debug("Login failed");

                appDB.login($scope.user.name, $scope.user.password).then(
                    function () {
                        $log.debug("Trying to sync...");
                        appDB.sync().then(
                            function () {
                                userManager.login($scope.user.name, $scope.user.password).then(
                                    function (status) {
                                        if (status.ok) {
                                            $log.debug("Second login successful");
                                            $location.path("/");
                                            appDB.syncLive();
                                        }
                                        else {
                                            $scope.error = status.message;
                                            $scope.isLoginBtnDisabled = false;
                                        }
                                    },
                                    function (err) {
                                        $scope.error = err.message;
                                        $scope.isLoginBtnDisabled = false;
                                    }
                                )
                            },
                            function (err) {
                                $scope.error = err.message;
                                $scope.isLoginBtnDisabled = false;
                            }
                        )
                    },
                    function (err) {
                        $scope.error = err.message;
                        $scope.isLoginBtnDisabled = false;
                    }
                );
            }

        };
    }]);


