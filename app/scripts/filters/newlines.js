'use strict';

/**
 * @ngdoc filter
 * @name hdbApp.filter:newlines
 * @function
 * @description
 * # newlines
 * Filter displaying linebreaks in html.
 */
angular.module('hdbApp')
    .filter('newlines', function () {
        return function (text) {
            return text.replace(/\n/g, '<br/>');
        };
    });
