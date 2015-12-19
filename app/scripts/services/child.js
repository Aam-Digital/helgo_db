'use strict';

/**
 * @ngdoc service
 * @name hdbApp.Child
 * @description
 * Class for Child entity. Provides entity specific functions.
 */
angular.module('hdbApp')
    .factory('Child', ['AbstractModel', '$log', '$q', 'appDB', 'Enrollment', 'FamilyMember', function (AbstractModel, $log, $q, appDB, Enrollment, FamilyMember) {
        var prefix = "child:";

        function Child(childData) {
            if (childData) {
                if (this._id === undefined) {
                    this._id = prefix + childData.pn;
                }
                if (childData.familyMembers === undefined) {
                    childData.familyMembers = [];
                }
                if (childData.currentStatus === undefined) {
                    childData.currentStatus = {};
                }

                this.setData(childData);
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
            update: function () {
                if(this._id != prefix + this.pn) {
                    throw "Child data inconsistent: 'pn' ("+this.pn+") does not match '_id' ("+this._id+").";
                }

                var data = angular.copy(this);
                appDB.put(data);

                this.saveStatus();
            },

            setData: function (data) {
                angular.extend(this, data);

                return this;
            },


            toString: function () {
                return this.name + ' [' + this.pn + ']';
            },

            age: function () {
                var now = new Date();
                var birth = new Date(this.dateOfBirth);
                var diff = now.getTime() - birth.getTime();
                return Math.ceil(diff / (1000 * 3600 * 24 * 365));
            },


            getEnrollments: function () {
                var deferred = $q.defer();

                var enrollmentPrefix = this._id + ":enrollment:";
                var scope = this;
                appDB.allDocs({include_docs: true, startkey: enrollmentPrefix, endkey: enrollmentPrefix + "\ufff0"})
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
                    function (data) {
                        var now = new Date();
                        data.forEach(function (enrollment) {
                            if (enrollment.until === undefined || (new Date(enrollment.until)).getTime() > now.getTime()) {
                                deferred.resolve(enrollment);
                            }
                        });
                        deferred.resolve(undefined); //no enrollment currently
                    },
                    function (err) {
                        $log.error("Error getCurrentEnrollment: " + err.message);
                        deferred.reject();
                    }
                );

                return deferred.promise;
            },


            getFamilyMember: function (id) {
                var deferred = $q.defer();

                var self = this;
                appDB.get(id).then(
                    function (data) {
                        var familyMember = new FamilyMember(data, self);
                        deferred.resolve(familyMember); //no enrollment currently
                    },
                    function (err) {
                        $log.error("Error getFamilyMember(" + id + "): " + err.message);
                        deferred.reject();
                    }
                );

                return deferred.promise;
            },

            getFamilyMembers: function () {
                var deferred = $q.defer();

                var promises = [];
                var family = [];
                for (var i = 0; i < this.familyMembers.length; i++) {
                    promises.push(this.getFamilyMember(this.familyMembers[i]).then(
                        function (member) {
                            family.push(member);
                        }
                    ));
                }
                $q.all(promises).then(function () {
                    deferred.resolve(family);
                })

                return deferred.promise;
            },


            getStatus: function (id) {
                var deferred = $q.defer();

                //if no parameter given, get current status
                if (id === undefined) {
                    id = this._id + ":status:previous";
                }

                appDB.get(id).then(
                    function (data) {
                        deferred.resolve(data); //no enrollment currently
                    },
                    function (err) {
                        $log.error("Error Child.getStatus(" + id + "): " + err.message);
                        deferred.reject(err);
                    }
                );

                return deferred.promise;
            },

            saveStatus: function () {
                var status = this.currentStatus;
                //check if anything changed
                var self = this;
                this.getStatus().then(
                    function (lastStatus) {
                        if (!self._statusEqual(status, lastStatus)) {
                            lastStatus._id = self._id + ":status:" + lastStatus.changed;
                            self._writeStatus(lastStatus);

                            status._rev = lastStatus._rev;
                            status.changed = (new Date()).toISOString();
                            self._writeStatus(status);
                        }
                    },
                    function (err) {
                        if (err.status == 404) {
                            self._writeStatus(status);
                        }
                    }
                );
            },
            _statusEqual: function (status1, status2) {
                return status1.projectStatus == status2.projectStatus &&
                    status1.socialworker == status2.socialworker &&
                    status1.photo == status2.photo &&
                    ((status1.address === undefined && status2.address == undefined) || (status1.address.text == status2.address.text && status1.address.visit == status2.address.visit)) &&
                    status1.villageAddress == status2.villageAddress;
            },
            _writeStatus: function (status) {
                if (status._id === undefined) {
                    status._id = this._id + ":status:previous";
                    status.changed = (new Date()).toISOString();
                }
                appDB.put(status).then(
                    function () {
                    },
                    function (err) {
                        $log.error("Error writing child's status (" + status._id + "): " + err.message);
                    }
                );
            },


            changePhoto: function (photo) {
                var photoId = this._id + ":photo";

                appDB.get(photoId).then(
                    function (doc) {
                        appDB.putAttachment(photoId, 'photo', doc._rev, photo, photo.type)
                            .catch(function (err) {
                                $log.error("Could not save photo to database: " + err.message);
                            });
                    },
                    function (err) {
                        if (err.status === 404) {
                            appDB.putAttachment(photoId, 'photo', photo, photo.type)
                                .catch(function (err) {
                                    $log.error("Could not save photo to database: " + err.message);
                                });
                        }
                    }
                );

                var timestamp = (new Date()).toISOString();
                appDB.putAttachment(photoId + ":" + timestamp, 'photo', photo, photo.type)
                    .catch(function (err) {
                        $log.error("Could not save photo version to database: " + err.message);
                    });
            },

            getPhoto: function () {
                var deferred = $q.defer();

                var photoId = this._id + ":photo";
                appDB.getAttachment(photoId, 'photo').then(
                    function (blob) {
                        var url = URL.createObjectURL(blob);
                        deferred.resolve(url);
                    },
                    function (err) {
                        if (err.status != 404) {
                            $log.error("Could not load photo attachment (" + this._id + "): " + err.message);
                        }
                        deferred.reject(err);
                    }
                );

                return deferred.promise;
            },


            setBirthCertificate: function (file) {
                appDB.putAttachment(this._id, 'birthCertificate', this._rev, file, file.type)
                    .catch(function (err) {
                        $log.error("Could not save birth certificate to database: " + err.message);
                    });
            },

            getBirthCertificate: function () {
                var deferred = $q.defer();

                appDB.getAttachment(this._id, 'birthCertificate').then(
                    function (blob) {
                        var url = URL.createObjectURL(blob);
                        deferred.resolve(url);
                    },
                    function (err) {
                        if (err.status != 404) {
                            $log.error("Could not load birth certificate attachment (" + this._id + "): " + err.message);
                        }
                        deferred.reject(err);
                    }
                );

                return deferred.promise;
            }

        });


        return Child;
    }]);
