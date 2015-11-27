'use strict';

/**
 * @ngdoc service
 * @name hdbApp.FamilyMember
 * @description
 * Class for a Child's FamilyMember entities. Provides entity specific functions.
 */
angular.module('hdbApp')
    .factory('FamilyMember', ['AbstractModel', 'appDB', function (AbstractModel, appDB) {
        function FamilyMember(data, child) {
            if (data) {
                this.setData(data);
                if (!this._id) {
                    var prefix = child._id + "familyMember:";
                    this._id = prefix + data.name;
                }
            }
        };

        FamilyMember.prototype = angular.extend({}, AbstractModel, {
            age: function () {
                var now = new Date();
                var birth = new Date(this.dateOfBirth);
                var diff = now.getTime() - birth.getTime();
                var age = Math.ceil(diff / (1000 * 3600 * 24 * 365));
                if (isNaN(age)) {
                    age = "";
                }
                return age;
            },
        });

        return FamilyMember;
    }]);
