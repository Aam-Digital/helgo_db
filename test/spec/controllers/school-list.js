'use strict';

describe('Controller: SchoolListCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var SchoolListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SchoolListCtrl = $controller('SchoolListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SchoolListCtrl.awesomeThings.length).toBe(3);
  });
});
