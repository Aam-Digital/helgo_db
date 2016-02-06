'use strict';

describe('Controller: AlertCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var AlertCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AlertCtrl = $controller('AlertCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AlertCtrl.awesomeThings.length).toBe(3);
  });
});
