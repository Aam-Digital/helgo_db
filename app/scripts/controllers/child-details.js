'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:ChildDetailsCtrl
 * @description
 * # ChildDetailsCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('ChildDetailsCtrl', ['$scope', '$sce', '$location', '$filter', '$log', '$routeParams', 'ngTableParams', 'childManager', 'Child', 'userManager', 'schoolManager', '$uibModal', '$timeout', 'alertManager',
        function ($scope, $sce, $location, $filter, $log, $routeParams, ngTableParams, childManager, Child, userManager, schoolManager, $uibModal, $timeout, alertManager) {
            $scope.save = saveForm;
            $scope.cancel = cancelForm;

            $scope.changePhoto = setPhotoFile;
            $scope.setBirthCertificate = setBirthCertificateFile;
            $scope.showFamilyMember = showFamilyMember;
            $scope.showEnrollment = showEnrollment;

            $scope.centers = ['Tikiapara', 'Liluah'];
            $scope.birthCertificateType = ['None', 'Gram Panchayat', 'Municipal Corporation', 'Court Affidavit', 'School Headmaster / Principal'];
            userManager.getAllSocialworkers().then(function (users) {
                $scope.socialworkers = users;
            });

            if ($routeParams.pn === "new") {
                initNewChild();
            }
            else {
                initExistingChild($routeParams.pn)
            }


            function initNewChild() {
                $scope.child = {};
                $scope.new = true;
                alertManager.addAlert('Creating a new child record.', alertManager.ALERT_SUCCESS);
            }

            function initExistingChild(pn) {
                childManager.get(pn).then(
                    function (child) {
                        loadChild2Scope(child);
                        loadTableFamily2Scope(child);
                        loadTableEnrollments2Scope(child);
                    },
                    function (err) {
                        alertManager.addAlert('The given child could not be loaded.', alertManager.ALERT_DANGER);
                        $log.error('The given child could not be loaded (' + err.message + ')');
                        initNewChild();
                    }
                );
            }


            function loadChild2Scope(child) {
                $scope.child = child;
                child.getPhoto().then(function (photo) {
                    $scope.childPhoto = photo;
                });
                child.getBirthCertificate().then(function (file) {
                    $scope.birthCertificate = file;
                });
            }

            function loadTableEnrollments2Scope(child) {
                $scope.tableEnrollments = new ngTableParams(
                    {
                        count: 25,
                        sorting: {
                            from: 'desc'
                        }
                    },
                    {
                        getData: function ($defer, params) {
                            child.getEnrollments().then(
                                function (data) {
                                    $scope.items = data;
                                    params.total(data.length);
                                    $defer.resolve($filter('orderBy')(data, params.orderBy()));
                                },
                                function (err) {
                                    $log.error("Could not load enrollment information. (" + err.message + ")");
                                }
                            )
                        }
                    }
                );
            }

            function loadTableFamily2Scope(child) {
                $scope.tableFamily = new ngTableParams(
                    {
                        count: 25,
                        sorting: {
                            isGuardian: 'desc'
                        }
                    },
                    {
                        getData: function ($defer, params) {
                            child.getFamilyMembers().then(
                                function (data) {
                                    $scope.items = data;
                                    params.total(data.length);
                                    $defer.resolve($filter('orderBy')(data, params.orderBy()));
                                },
                                function (err) {
                                    $log.error("Could not load enrollment information. (" + err.message + ")");
                                }
                            );
                        }
                    }
                );
            }


            function setPhotoFile(fileInput) {
                var photo = fileInput.files[0];

                //display photo immediately
                var reader = new FileReader();
                reader.readAsDataURL(photo);
                reader.onload = function (oFREvent) {
                    $scope.childPhoto = oFREvent.target.result;
                };

                $scope.child.changePhoto(photo).catch(function (err) {
                    alertManager.addAlert("Couldn't save the photo to the database: " + err.message, alertManager.ALERT_DANGER);
                });
            }

            function setBirthCertificateFile(fileInput) {
                var file = fileInput.files[0];

                //display download link immidiately
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (oFREvent) {
                    $scope.birthCertificate = oFREvent.target.result;
                };

                $scope.child.setBirthCertificate(file).catch(function (err) {
                    alertManager.addAlert("Couldn't save the file to the database: " + err.message, alertManager.ALERT_DANGER);
                });
            }


            function showFamilyMember(familyMember) {
                var modalScope = $scope.$new(true);
                modalScope.selectedFamilyMember = familyMember;
                modalScope.selectedChild = $scope.child;

                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'views/familymember.html',
                    controller: 'FamilymemberCtrl',
                    scope: modalScope
                });

                modalInstance.result.then(function () {
                    loadTableFamily2Scope($scope.child);
                });
            }

            function showEnrollment(enrollment) {
                if (enrollment == "new") {
                    showEnrollmentModal(enrollment);
                }
                else {
                    var msg = $sce.trustAsHtml('<p>These "enrollments" are designed to show the complete school life of the child. Please check carefully whether you really need to edit or delete this entry. ' +
                        'Often it is more appropriate to add an additional entry through the "Update Class/School" button on the upper right of the section.</p>' +
                        '<p><em>Edit only to correct errors. If the child did go to this school and class sometime, you should not edit or delete the entry but rather add a new one.</em></p>' +
                        '<p>Continue to edit the entry?</p>');

                    var confirmScope = $scope.$new(true);
                    confirmScope.dialog = {
                        title: "Do you really want to edit?",
                        body: msg
                    };
                    var confirmationModal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/confirmation-modal.html',
                        scope: confirmScope
                    });
                    confirmationModal.result.then(function () {
                        showEnrollmentModal(enrollment);
                    });
                }
            }

            function showEnrollmentModal(enrollment) {
                var modalScope = $scope.$new(true);
                modalScope.selectedEnrollment = enrollment;
                modalScope.selectedChild = $scope.child;

                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'views/enrollment.html',
                    controller: 'EnrollmentCtrl',
                    scope: modalScope
                });

                modalInstance.result.then(function () {
                    loadTableEnrollments2Scope($scope.child);
                });
            }


            function saveForm() {
                var child = $scope.child;

                if ($scope.new) {
                    child = new Child(child);
                    alertManager.addAlert('Creating a new child record.', alertManager.ALERT_SUCCESS);
                }

                child.update();
                $scope.new = false;

                alertManager.addAlert('Saved changes!', alertManager.ALERT_SUCCESS);
                $location.path("/child");
            }

            function cancelForm() {
                childManager.uncache($scope.child.pn);
                $scope.child = {};
                $location.path("/child");
            }
        }]);
