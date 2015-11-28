'use strict';

describe('Controller: ChildListCtrl', function () {

  // load the controller's module
  beforeEach(module('hdbApp'));

  var ChildListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChildListCtrl = $controller('ChildListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
