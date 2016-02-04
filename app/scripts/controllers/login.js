'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LoginCtrl', ['$scope', '$analytics', '$location', '$log', 'userManager', 'appDB', 'cookie', function ($scope, $analytics, $location, $log, userManager, appDB, cookie) {

        $scope.isLoginBtnDisabled = false;

        $scope.login = function login() {
            $scope.isLoginBtnDisabled = true;

            if (!$scope.user.password) {
                $scope.user.password = "";
            }

            // try the local login first
            userManager.login($scope.user.name, $scope.user.password).then(
                function (status) {
                    if (status.ok) {
                        $log.debug("Local login successful.");
                        appDB.login($scope.user.name, $scope.user.password).then(
                            function () {
                                // local login successful, replicate the database and activate live sync
                                appDB.sync().then(
                                    // if sync failed, check if database is outdated
                                    function (err) {
                                        if (appDB.isOutdated()) {
                                            // TODO replace logging with alert
                                            $log.debug("Database is outdated, please go online to synchronize");
                                        }
                                    });
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
                        appDB.sync().then(
                            function () {
                                userManager.login($scope.user.name, $scope.user.password).then(
                                    function (status) {
                                        if (status.ok) {
                                            $log.debug("Local login successful.");
                                            $location.path("/");
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


