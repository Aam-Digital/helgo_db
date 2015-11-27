'use strict';

/**
 * @ngdoc service
 * @name hdbApp.childManager
 * @description
 * Provides access to Child entities in the database.
 */
angular.module('hdbApp')
    .factory('childManager', ['$q', 'DbManager', 'Child', function ($q, DbManager, Child) {
        var manager = new DbManager(Child);

        angular.extend(manager, {
            getStudentsOfSchool: function (school) {
                var deferred = $q.defer();

                var scope = this;
                this.getAll().then(
                    function (data) {
                        var students = [];
                        var promises = [];
                        data.forEach(function (child) {
                            promises.push(child.getCurrentEnrollment().then(
                                function (currentEnrollment) {
                                    if (currentEnrollment !== undefined && currentEnrollment.school._id == school._id) {
                                        students.push({
                                            '_id': child._id,
                                            'pn': child.pn,
                                            'name': child.name,
                                            'grade': currentEnrollment.grade
                                        });
                                    }
                                }
                            ));
                        });

                        // wait for all child.getCurrentEnrollment() to finish
                        $q.all(promises).then(
                            function () {
                                deferred.resolve(students);
                            }
                        );
                    },
                    function (err) {
                        $log.error("Error getStudentsOfSchool: " + err.message);
                        deferred.reject();
                    }
                );

                return deferred.promise;
            },
        });

        return manager;
    }]);
