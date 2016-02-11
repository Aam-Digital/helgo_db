'use strict';

/**
 * @ngdoc service
 * @name hdbApp.Enrollment
 * @description
 * Class for a Child's Enrollment information. Provides entity specific functions.
 */
angular.module('hdbApp')
    .factory('Enrollment', ['AbstractModel', 'appDB', 'schoolManager', function (AbstractModel, appDB, schoolManager) {
        function Enrollment(data) {
            if (data) {
                this.setData(data);
                if (!this._id) {
                    var prefix = data.child + ":enrollment:";
                    var date = data.from.getFullYear() + "-" + data.from.getMonth() + "-" + data.from.getDate();
                    this._id = prefix + date;
                }
            }
        }

        Enrollment.prototype = angular.extend({}, AbstractModel, {
            update: function () {
                var data = angular.copy(this);
                data.school = this.school._id;

                appDB.put(data);
            },

            setData: function (data) {
                var scope = this;
                if (typeof data.school === 'string') {
                    schoolManager.get(data.school).then(
                        function (school) {
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
