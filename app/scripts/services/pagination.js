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
        this.paginate = function ($defer, params, scope, data) {
            params.total(data.length);
            scope.count = data.length;
            scope.items = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
            $defer.resolve($filter('orderBy')(scope.items, params.orderBy()));
        }
    }]);
