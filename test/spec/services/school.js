'use strict';

describe('Service: School', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var School;
  beforeEach(inject(function (_School_) {
    School = _School_;
  }));
});
