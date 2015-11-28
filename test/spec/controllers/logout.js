'use strict';

describe('Controller: LogoutCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var LogoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LogoutCtrl = $controller('LogoutCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
