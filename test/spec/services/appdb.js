'use strict';

describe('Service: appDb', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var appDb;
  beforeEach(inject(function (_appDb_) {
    appDb = _appDb_;
  }));

  it('should do something', function () {
    expect(!!appDb).toBe(true);
  });

});
