'use strict';

describe('Service: childManager', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var childManager;
  beforeEach(inject(function (_childManager_) {
    childManager = _childManager_;
  }));

  it('should do something', function () {
    expect(!!childManager).toBe(true);
  });

});
