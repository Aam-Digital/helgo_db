'use strict';

/**
 * @ngdoc service
 * @name hdbApp.pagination
 * @description
 * # pagination
 * Service in the hdbApp.
 */
angular.module('hdbApp')
    .service('pagination', ['$filter', function ($filter) {
        this.paginate = function (params, data) {
            params.total(data.length);
            var items = $filter('orderBy')(data, params.orderBy());
            items = items.slice((params.page() - 1) * params.count(), params.page() * params.count());
            return items;
        }
    }]);
