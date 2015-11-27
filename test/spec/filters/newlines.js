'use strict';

describe('Filter: newlines', function () {

  // load the filter's module
  beforeEach(module('hdbApp'));

  // initialize a new instance of the filter before each test
  var newlines;
  beforeEach(inject(function ($filter) {
    newlines = $filter('newlines');
  }));

  it('should return the input prefixed with "newlines filter:"', function () {
    var text = 'angularjs';
    expect(newlines(text)).toBe('newlines filter: ' + text);
  });

});
