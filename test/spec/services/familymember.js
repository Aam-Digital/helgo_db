'use strict';

describe('Service: FamilyMember', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var FamilyMember;
  beforeEach(inject(function (_FamilyMember_) {
    FamilyMember = _FamilyMember_;
  }));

  it('should do something', function () {
    expect(!!FamilyMember).toBe(true);
  });

});
