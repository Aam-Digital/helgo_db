'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LoginCtrl', ['$scope', '$analytics', '$location', '$log', 'userManager', 'appDB', function ($scope, $analytics, $location, $log, userManager, appDB) {

        $scope.isLoginBtnDisabled = false;

        $scope.login = function login() {
            $scope.isLoginBtnDisabled = true;

            if (!$scope.user.password) {
                $scope.user.password = "";
            }
            userManager.login($scope.user.name, $scope.user.password).then(
                function (status) {
                    if (status.ok) {
                        $log.debug("Local login successful.");
                        appDB.login($scope.user.name, $scope.user.password).then(
                            function () {
                                appDB.sync(true);
                            }, function (err) {
                                $log.debug("Remote login failed: ");
                                $log.debug(err);
                            }
                        );
                        $analytics.eventTrack($scope.user.name, {category: 'user', label: $scope.user.name});
                        $location.path("/");
                    } else {
                        _loginFailed();
                    }
                }, function () {
                    _loginFailed();
                }
            );

            function _loginFailed() {
                $log.debug("Local login failed, is a local database available?");

                appDB.login($scope.user.name, $scope.user.password).then(
                    function () {
                        $log.debug("Remote login successful, trying to sync the database...");
                        appDB.sync(false).then(
                            function () {
                                userManager.login($scope.user.name, $scope.user.password).then(
                                    function (status) {
                                        if (status.ok) {
                                            $log.debug("Local login successful.");
                                            $location.path("/");
                                            appDB.sync(true);
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


