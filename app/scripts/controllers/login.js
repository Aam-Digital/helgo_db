'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('LoginCtrl', ['$scope', '$analytics', '$location', '$log', '$uibModal', 'userManager', 'appDB', 'latestChanges', 'alertManager',
        function ($scope, $analytics, $location, $log, $uibModal, userManager, appDB, latestChanges, alertManager) {

            $scope.isLoginBtnDisabled = false;
            var modal;

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
                                                alertManager.addAlert('You are working on an outdated database, please ' +
                                                    'online as soon as possible to synchronize the database!', alertManager.ALERT_WARNING);
                                            }
                                            $log.debug(err);
                                            // TODO show info icon: you are working offline?
                                        });
                                }, function (err) {
                                    $log.debug("Remote login failed: ");
                                    $log.debug(err);
                                }
                            );
                            onLoginComplete();
                        } else {
                            _localLoginFailed();
                        }
                    }, function () {
                        _localLoginFailed();
                    }
                );

                // local login using the database failed
                function _localLoginFailed() {
                    $log.debug("Local login failed, is a local database available?");
                    showDownloadProgress();

                    // try remote login
                    appDB.login($scope.user.name, $scope.user.password).then(
                        function () {
                            $log.debug("Remote login successful, trying to sync the database...");
                            appDB.sync().then(
                                function () {
                                    userManager.login($scope.user.name, $scope.user.password).then(
                                        function (status) {
                                            if (status.ok) {
                                                $log.debug("Local login successful.");
                                                onLoginComplete();
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
                                    );
                                    modal.close();
                                },
                                function (err) {
                                    $scope.error = err.message;
                                    $scope.isLoginBtnDisabled = false;
                                    modal.close();
                                }
                            )
                        },
                        function (err) {
                            $scope.error = err.message;
                            $scope.isLoginBtnDisabled = false;
                            modal.close();
                        }
                    );
                }

                function onLoginComplete() {
                    $location.path("/");

                    $analytics.eventTrack($scope.user.name, {category: 'user', label: $scope.user.name});

                    var user = userManager.getCurrentUser();
                    latestChanges.check(user.settings.lastKnownVersion).then(function (res) {
                        if (res) {
                            user.settings.lastKnownVersion = res;
                            user.update();
                            $log.info("Updated to new version.");
                        }
                    });
                }

                function showDownloadProgress() {
                    modal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/download-progress.html',
                        controller: 'LoginCtrl'
                    });
                }
            };
        }]);
