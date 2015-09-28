
angular.module('myApp.child', [
    'myApp.appDB',
])

    .factory('Child', ['AbstractModel', '$q', 'appDB', 'Enrollment', function (AbstractModel, $q, appDB, Enrollment) {
        var prefix = "child:";

        function Child(childData) {
            if (childData) {
                this.setData(childData);
                this._id = prefix + childData.pn;
            }
        };

        Child.prefix = prefix;

        Child.prototype = angular.extend({}, AbstractModel, {
            _poolEnrollment: {},
            _retrieveEnrollment: function (id, data) {
                var instance = this._poolEnrollment[id];

                if (instance) {
                    instance.setData(data);
                } else {
                    instance = new Enrollment(data);
                    this._poolEnrollment[id] = instance;
                }

                return instance;
            },


            /* Public Methods */
            toString: function() {
                return this.name+' ['+this.pn+']';
            },

            age: function () {
                var now = new Date();
                var birth = new Date(this.dateOfBirth);
                var diff = now.getTime() - birth.getTime();
                return Math.ceil(diff / (1000 * 3600 * 24 * 365));
            },


            getEnrollments: function () {
                var deferred = $q.defer();

                var enrollmentPrefix = this._id+":enrollment:";
                var scope = this;
                appDB.allDocs({include_docs: true, startkey: enrollmentPrefix, endkey: enrollmentPrefix+"\ufff0"})
                    .then(function (dataArray) {
                        var items = [];
                        dataArray.rows.forEach(function (row) {
                            var data = row.doc;
                            var o = scope._retrieveEnrollment(data._id, data);
                            items.push(o);
                        });

                        deferred.resolve(items);
                    },
                    function (err) {
                        deferred.reject();
                    });

                return deferred.promise;
            },

            getCurrentEnrollment: function () {
                var deferred = $q.defer();

                var enrollments = this.getEnrollments().then(
                    function(data) {
                        var now = new Date();
                        data.forEach(function (enrollment) {
                            if(enrollment.until === undefined || enrollment.until.getTime() > now.getTime()) {
                                deferred.resolve(enrollment);
                            }
                        });
                        deferred.resolve(undefined); //no enrollment currently
                    },
                    function(err) {
                        $log.error("Error getCurrentEnrollment: "+err.message);
                        deferred.reject();
                    }
                );

                return deferred.promise;
            },
        });

        return Child;
    }])


    .factory('childrenManager', ['$q', 'DbManager', 'Child', function ($q, DbManager, Child) {
        var manager = new DbManager(Child);

        angular.extend(manager, {
            getStudentsOfSchool: function(school) {
                var deferred = $q.defer();

                var scope = this;
                this.getAll().then(
                    function(data) {
                        var students = [];
                        var promises = [];
                        data.forEach(function (child) {
                            promises.push(child.getCurrentEnrollment().then(
                                function (currentEnrollment) {
                                    if (currentEnrollment !== undefined && currentEnrollment.school._id == school._id) {
                                        students.push(child);
                                    }
                                }
                            ));
                        });

                        // wait for all child.getCurrentEnrollment() to finish
                        $q.all(promises).then(
                            function() {
                                deferred.resolve(students);
                            }
                        );
                    },
                    function(err) {
                        $log.error("Error getStudentsOfSchool: "+err.message);
                        deferred.reject();
                    }
                );

                return deferred.promise;
            },
        });

        return manager;
    }])




    .factory('Enrollment', ['AbstractModel', 'appDB', 'schoolManager', function (AbstractModel, appDB, schoolManager) {
        function Enrollment(data) {
            if (data) {
                this.setData(data);
                if(!this._id) {
                    var prefix = data.child + ":enrollment:";
                    var date = data.from.getFullYear()+"-"+data.from.getMonth()+"-"+data.from.getDate();
                    this._id =  prefix + date;
                }
            }
        };

        Enrollment.prototype = angular.extend({}, AbstractModel, {
            update: function () {
                var data = angular.copy(this);
                data.school = this.school._id;

                appDB.put(data);
            },

            setData: function (data) {
                var scope = this;
                if(typeof data.school === 'string') {
                    schoolManager.get(data.school).then(
                        function(school) {
                            scope.school = school;
                        }
                    )
                }

                angular.extend(this, data);
                return this;
            },

        });

        return Enrollment;
    }]);
