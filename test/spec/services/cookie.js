'use strict';

describe('Service: cookie', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var cookie;
  beforeEach(inject(function (_cookie_) {
    cookie = _cookie_;
  }));

  it('should do something', function () {
    expect(!!cookie).toBe(true);
  });

});
