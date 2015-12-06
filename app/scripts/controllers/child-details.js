'use strict';

/**
 * @ngdoc function
 * @name hdbApp.controller:ChildDetailsCtrl
 * @description
 * # ChildDetailsCtrl
 * Controller of the hdbApp
 */
angular.module('hdbApp')
    .controller('ChildDetailsCtrl', ['$scope', '$sce', '$location', '$filter', '$log', '$routeParams', 'ngTableParams', 'childManager', 'Child', 'userManager', 'schoolManager', '$modal', '$timeout',
        function ($scope, $sce, $location, $filter, $log, $routeParams, ngTableParams, childManager, Child, userManager, schoolManager, $modal, $timeout) {
            var loadEnrollments = function (child) {
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
                        },
                    }
                );
            };

            var loadFamily = function (child) {
                $scope.tableFamily = new ngTableParams(
                    {
                        count: 25,
                        sorting: {
                            isGuardian: 'asc'
                        }
                    },
                    {
                        getData: function ($defer, params) {
                            var data = child.getFamilyMembers().then(
                                function (data) {
                                    $scope.items = data;
                                    params.total(data.length);
                                    $defer.resolve($filter('orderBy')(data, params.orderBy()));
                                },
                                function (err) {
                                    $log.error("Could not load enrollment information. (" + err.message + ")");
                                }
                            );
                        },
                    }
                );
            };

            var param = $routeParams.pn;
            if (param === "new") {
                $scope.child = {};
                $scope.new = true;
            }
            else {
                childManager.get(param).then(
                    function (child) {
                        $scope.child = child;
                        child.getPhoto().then(function (photo) {
                            console.log(photo);
                            $scope.childPhoto = photo;
                        });
                        child.getBirthCertificate().then(function (file) {
                            console.log(file);
                            $scope.birthCertificate = file;
                        });

                        loadFamily(child);
                        loadEnrollments(child);
                    },
                    function (err) {
                        $scope.error = "The given child could not be loaded.";

                        $scope.child = {};
                        $scope.new = true;
                    }
                );
            }

            $scope.changePhoto = function (fileInput) {
                var photo = fileInput.files[0];

                //display photo immediately
                var reader = new FileReader();
                reader.readAsDataURL(photo);
                reader.onload = function (oFREvent) {
                    $scope.childPhoto = oFREvent.target.result;
                };

                $scope.child.changePhoto(photo);
            };


            $scope.save = function () {
                var child = $scope.child;

                if ($scope.new) {
                    child = new Child(child);
                }

                child.update();

                $scope.savedMsg = true;
                $timeout(function () {
                    $scope.savedMsg = false;
                }, 3000);
            };

            $scope.showEnrollment = function (enrollment) {
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
                        body: msg,
                    };
                    var confirmationModal = $modal.open({
                        animation: true,
                        templateUrl: 'views/confirmation-modal.html',
                        scope: confirmScope,
                    });
                    confirmationModal.result.then(function (res) {
                        showEnrollmentModal(enrollment);
                    });
                }
            };

            var showEnrollmentModal = function (enrollment) {
                var modalScope = $scope.$new(true);
                modalScope.selectedEnrollment = enrollment;
                modalScope.selectedChild = $scope.child;

                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'views/enrollment.html',
                    controller: 'EnrollmentCtrl',
                    scope: modalScope,
                });

                modalInstance.result.then(function (res) {
                    loadEnrollments($scope.child);
                });
            };


            $scope.showFamilyMember = function (familyMember) {
                var modalScope = $scope.$new(true);
                modalScope.selectedFamilyMember = familyMember;
                modalScope.selectedChild = $scope.child;

                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'views/familymember.html',
                    controller: 'FamilymemberCtrl',
                    scope: modalScope,
                });

                modalInstance.result.then(function (res) {
                    loadFamily($scope.child);
                });
            };


            userManager.getAllSocialworkers().then(function (users) {
                $scope.socialworkers = users;
            });

            $scope.centers = ['Tikiapara', 'Liluah'];
            $scope.birthCertificateType = ['None', 'Gram Panchayat', 'Municipal Corporation', 'Court Affidavit', 'School Headmaster / Principal'];

        }]);
