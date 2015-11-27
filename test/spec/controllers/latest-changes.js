'use strict';

describe('Controller: LatestChangesCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var LatestChangesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LatestChangesCtrl = $controller('LatestChangesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LatestChangesCtrl.awesomeThings.length).toBe(3);
  });
});
