'use strict';

describe('Service: DbManager', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var DbManager;
  beforeEach(inject(function (_DbManager_) {
    DbManager = _DbManager_;
  }));

  it('should do something', function () {
    expect(!!DbManager).toBe(true);
  });

});
