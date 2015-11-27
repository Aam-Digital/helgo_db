'use strict';

/**
 * @ngdoc service
 * @name hdbApp.AbstractModel
 * @description
 * # AbstractModel
 * Abstract base class for all data models.
 */
angular.module('hdbApp')
    .factory('AbstractModel', ['$log', 'appDB', function ($log, appDB) {
        return {
            setData: function (data) {
                angular.extend(this, data);
                return this;
            },
            delete: function () {
                return appDB.remove(this);
            },
            update: function () {
                return appDB.put(this);
            },
        };
    }]);
