'use strict';

describe('Controller: ChildDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var ChildDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChildDetailsCtrl = $controller('ChildDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChildDetailsCtrl.awesomeThings.length).toBe(3);
  });
});
