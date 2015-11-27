'use strict';

describe('Controller: EnrollmentCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var EnrollmentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EnrollmentCtrl = $controller('EnrollmentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EnrollmentCtrl.awesomeThings.length).toBe(3);
  });
});
