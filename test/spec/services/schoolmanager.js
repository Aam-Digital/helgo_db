'use strict';

describe('Service: schoolManager', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var schoolManager;
  beforeEach(inject(function (_schoolManager_) {
    schoolManager = _schoolManager_;
  }));
});
