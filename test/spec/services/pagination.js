'use strict';

describe('Service: pagination', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var pagination;
  beforeEach(inject(function (_pagination_) {
    pagination = _pagination_;
  }));

  it('should do something', function () {
    expect(!!pagination).toBe(true);
  });

});
