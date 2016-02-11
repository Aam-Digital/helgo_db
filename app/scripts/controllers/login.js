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
            $scope.user = {name: "", password: ""};
            $scope.login = login;
            var modal;

            function login() {
                $scope.isLoginBtnDisabled = true;

                // try the local login first
                userManager.login($scope.user.name, $scope.user.password).then(
                    function (status) {
                        if (status.ok) {
                            _localLoginSuccessful();
                        } else {
                            _tryRemoteDatabaseDownload();
                        }
                    }, function () {
                        _tryRemoteDatabaseDownload();
                    }
                );
            }


            function _localLoginSuccessful() {
                $log.debug("Local login successful.");
                appDB.login($scope.user.name, $scope.user.password).then(
                    function () {
                        // local login successful, replicate the database and activate live sync
                        appDB.sync()
                            .catch(function () {
                                checkAndWarnOutdatedLocalDatabase();
                            });
                    }, function (err) {
                        $log.debug("Remote login failed: ");
                        $log.debug(err);
                        checkAndWarnOutdatedLocalDatabase();
                    }
                );

                onLoginComplete();
            }

            // local login using the database failed
            function _tryRemoteDatabaseDownload() {
                $log.debug("Local login failed, is a local database available?");
                showDownloadProgress();

                // try remote login
                appDB.login($scope.user.name, $scope.user.password).then(
                    function () {
                        _remoteLoginSuccessful();
                    },
                    function (err) {
                        $scope.error = err.message;
                        $scope.isLoginBtnDisabled = false;
                        modal.close();
                    }
                );
            }

            function showDownloadProgress() {
                modal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/download-progress.html',
                    controller: 'LoginCtrl'
                });
            }

            function _remoteLoginSuccessful() {
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
            }

            function checkAndWarnOutdatedLocalDatabase() {
                if (appDB.isOutdated()) {
                    alertManager.addAlert('You are working on an outdated database, please ' +
                        'online as soon as possible to synchronize the database!', alertManager.ALERT_WARNING);
                }
                // TODO show info icon: you are working offline?
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
        }]);
