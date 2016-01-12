'use strict';

/**
 * @ngdoc hdbApp.latestChanges
 * @name latestChanges
 * @description
 * Module displaying version and latest changes.
 * Expects a file 'changelog.json' in the root of the app folder containing versioning details.
 */
angular
    .module('hdbApp.latestChanges', [
        'ui.bootstrap'
    ]);
