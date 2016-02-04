'use strict';

describe('Service: alertManager', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var alertManager;
  beforeEach(inject(function (_alertManager_) {
    alertManager = _alertManager_;
  }));

  it('should do something', function () {
    expect(!!alertManager).toBe(true);
  });

});
