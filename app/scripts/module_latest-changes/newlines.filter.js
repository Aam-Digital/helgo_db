'use strict';

/**
 * @ngdoc filter
 * @name hdbApp.filter:newlines
 * @function
 * @description
 * # newlines
 * Filter displaying linebreaks in html.
 */
angular.module('hdbApp.latestChanges')
    .filter('newlines', function () {
        return function (text) {
            if(!text) {
                return "";
            }

            return text.replace(/\n/g, '<br/>');
        };
    });
