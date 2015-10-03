'use strict';

angular.module('myApp.view.child', [
    'ngRoute',
    'ngTable',
    'ui.bootstrap',
    'myApp.search',
    'myApp.school',
    'myApp.view.school',
    'myApp.user',
])

    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
        $routeProvider
            .when('/child', {
                templateUrl: 'view/child/child-list.html',
                controller: 'ChildListController'
            })
            .when('/child/:pn', {
                templateUrl: 'view/child/child-details.html',
                controller: 'ChildDetailsController'
            });

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }])

    .directive('searchChild', ['$location', 'childrenManager', function($location, childrenManager) {
        return {
            restrict: 'E',
            template: '<search items="children" item-execute="openChild"></search>',

            link: function(scope, element, attrs) {
                childrenManager.getAll().then(function(data) {
                    scope.children = data;
                    scope.openChild = function(child) {
                        $location.path("/child/" + child.pn);
                    };
                });
            },
        };
    }])


    .controller('ChildListController', ['$scope', '$location', '$filter', '$log', 'ngTableParams', 'Child', 'childrenManager', function ($scope, $location, $filter, $log, ngTableParams, Child, childrenManager) {
        $scope.tableParams = new ngTableParams(
            {
                count: 25,
            },
            {
                getData: function ($defer, params) {
                    childrenManager.getAll().then(
                        function (data) {
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve($filter('orderBy')(data, params.orderBy()));
                        },
                        $log.error);
                },
            }
        );

        $scope.showChild = function (pn) {
            $location.path("/child/" + pn);
        };
    }])


    .controller('ChildDetailsController', ['$scope', '$sce', '$location', '$filter', '$log', '$routeParams', 'ngTableParams', 'childrenManager', 'Child', 'userManager', 'schoolManager', '$modal',
    function ($scope, $sce, $location, $filter, $log, $routeParams, ngTableParams, childrenManager, Child, userManager, schoolManager, $modal) {
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
                            function(data) {
                                $scope.items = data;
                                params.total(data.length);
                                $defer.resolve($filter('orderBy')(data, params.orderBy()));
                            },
                            function(err) {
                                $log.error("Could not load enrollment information. ("+err.message+")");
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
                            function(data) {
                                $scope.items = data;
                                params.total(data.length);
                                $defer.resolve($filter('orderBy')(data, params.orderBy()));
                            },
                            function(err) {
                                $log.error("Could not load enrollment information. ("+err.message+")");
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
            childrenManager.get(param).then(
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
        };

        $scope.showEnrollment = function (enrollment) {
            if(enrollment == "new") {
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
                    templateUrl: 'view/confirmation-modal.html',
                    scope: confirmScope,
                });
                confirmationModal.result.then(function (res) {
                    showEnrollmentModal(enrollment);
                });
            }
        };

        var showEnrollmentModal = function(enrollment) {
            var modalScope = $scope.$new(true);
            modalScope.selectedEnrollment = enrollment;
            modalScope.selectedChild = $scope.child;

            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'view/child/enrollment-modal.html',
                controller: 'EnrollmentModalController',
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
                templateUrl: 'view/child/familymember-modal.html',
                controller: 'FamilyMemberModalController',
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

    }])


    .controller('EnrollmentModalController', ['$scope', '$modalInstance', 'schoolManager', 'Enrollment', function ($scope, $modalInstance, schoolManager, Enrollment) {
        if($scope.selectedEnrollment === "new") {
            $scope.selectedEnrollment = {};
            $scope.newEnrollment = true;
        }

        $scope.saveEnrollment = function () {
            //TODO: confirm

            $scope.selectedEnrollment.child = $scope.selectedChild._id;
            if($scope.newEnrollment) {
                $scope.selectedEnrollment = new Enrollment($scope.selectedEnrollment);
            }

            $scope.selectedEnrollment.update();
            $modalInstance.close();
        };

        $scope.deleteEnrollment = function () {
            //TODO: confirm

            $scope.selectedEnrollment.delete();
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };


        schoolManager.getAll().then(function (schools) {
            $scope.schools = schools;
        });
    }])


    .controller('FamilyMemberModalController', ['$scope', '$modalInstance', 'FamilyMember', function ($scope, $modalInstance, FamilyMember) {
        if($scope.selectedFamilyMember === "new") {
            $scope.selectedFamilyMember = {};
            $scope.newFamilyMember = true;
        }

        $scope.saveFamilyMember = function () {
            if(!$scope.formUpdateFamilyMember.$valid) {
                return;
            }

            if($scope.newFamilyMember) {
                $scope.selectedFamilyMember = new FamilyMember($scope.selectedFamilyMember, $scope.selectedChild);

                $scope.selectedChild.familyMembers.push($scope.selectedFamilyMember._id);
                $scope.selectedChild.update();
            }
            $scope.selectedFamilyMember.update().then(
                function() {},
                function(err) {
                    $log.error("Error saving family member ("+$scope.selectedFamilyMember._id+"): "+err.message);
                }
            );
            $modalInstance.close();
        };

        $scope.deleteFamilyMember = function () {
            for(var i = 0; i < $scope.selectedChild.familyMembers.length; i++) {
                if($scope.selectedChild.familyMembers[i] == $scope.selectedFamilyMember._id) {
                    $scope.selectedChild.familyMembers.splice(i,1);
                    break;
                }
            }
            $scope.selectedChild.update();

            $scope.selectedFamilyMember.delete();

            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }]);

