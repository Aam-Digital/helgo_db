'use strict';

describe('Controller: FamilymemberCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var FamilymemberCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FamilymemberCtrl = $controller('FamilymemberCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
