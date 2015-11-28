'use strict';

describe('Controller: SchoolDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var SchoolDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SchoolDetailsCtrl = $controller('SchoolDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
