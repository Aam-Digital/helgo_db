'use strict';

/**
 * @ngdoc service
 * @name hdbApp.School
 * @description
 * Class for a School entity. Provides entity specific functions.
 */
angular.module('hdbApp')
    .factory('School', ['AbstractModel', function (AbstractModel) {
        var prefix = "school:";

        function School(data) {
            if (data) {
                this.setData(data);
                this._id = prefix + data.name;
            }
        }

        School.prefix = prefix;

        School.prototype = angular.extend({}, AbstractModel, {
            toString: function () {
                var extMedium = "";
                if (this.medium) {
                    extMedium = " (" + this.medium + " Medium)";
                }
                return this.name + extMedium;
            }
        });

        return School;
    }]);
