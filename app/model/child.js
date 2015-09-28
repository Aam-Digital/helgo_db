
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
                var enrollmentPrefix = this._id+":enrollment:";
                var deferred = $q.defer();
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
        });

        return Child;
    }])


    .factory('childrenManager', ['DbManager', 'Child', function (DbManager, Child) {
        var manager = new DbManager(Child);

        angular.extend(manager, {
            // add functions/fields to extend baseManager here
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
                console.log(this);
                var data = angular.copy(this);
                data.school = this.school._id;

                console.log(this);
                appDB.put(data);
                console.log(this);
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
