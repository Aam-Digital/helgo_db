'use strict';

describe('Service: Child', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var Child;
  beforeEach(inject(function (_Child_) {
    Child = _Child_;
  }));
});
