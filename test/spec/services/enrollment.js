'use strict';

describe('Service: Enrollment', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var Enrollment;
  beforeEach(inject(function (_Enrollment_) {
    Enrollment = _Enrollment_;
  }));

  it('should do something', function () {
    expect(!!Enrollment).toBe(true);
  });

});
