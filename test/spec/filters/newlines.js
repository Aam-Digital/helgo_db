'use strict';

describe('Filter: newlines', function () {

  // load the filter's module
  beforeEach(module('hdbApp'));

  // initialize a new instance of the filter before each test
  var newlines;
  beforeEach(inject(function ($filter) {
    newlines = $filter('newlines');
  }));
});
