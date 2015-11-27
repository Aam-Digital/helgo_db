'use strict';

describe('Directive: searchSchool', function () {

  // load the directive's module
  beforeEach(module('hdbApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-school></search-school>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the searchSchool directive');
  }));
});
