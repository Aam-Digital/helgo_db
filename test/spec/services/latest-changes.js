'use strict';

describe('Service: latestChanges', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var latestChanges;
  beforeEach(inject(function (_latestChanges_) {
    latestChanges = _latestChanges_;
  }));
});
