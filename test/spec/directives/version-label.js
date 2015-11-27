'use strict';

describe('Directive: versionLabel', function () {

  // load the directive's module
  beforeEach(module('hdbApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<version-label></version-label>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the versionLabel directive');
  }));
});
