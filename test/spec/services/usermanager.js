'use strict';

describe('Service: userManager', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var userManager;
  beforeEach(inject(function (_userManager_) {
    userManager = _userManager_;
  }));
});
