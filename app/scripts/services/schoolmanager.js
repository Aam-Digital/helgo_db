'use strict';

/**
 * @ngdoc service
 * @name hdbApp.schoolManager
 * @description
 * Provides access to School entities in the database.
 */
angular.module('hdbApp')
    .factory('schoolManager', ['DbManager', 'School', function (DbManager, School) {
        var manager = new DbManager(School);

        angular.extend(manager, {
            // add functions/fields to extend baseManager here
        });

        return manager;
    }]);
