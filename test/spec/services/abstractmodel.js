'use strict';

describe('Service: AbstractModel', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var AbstractModel;
  beforeEach(inject(function (_AbstractModel_) {
    AbstractModel = _AbstractModel_;
  }));

  it('should do something', function () {
    expect(!!AbstractModel).toBe(true);
  });

});
