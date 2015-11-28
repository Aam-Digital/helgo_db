'use strict';

describe('Service: appConfig', function () {

  // load the service's module
  beforeEach(module('hdbApp'));

  // instantiate service
  var appConfig;
  beforeEach(inject(function (_appConfig_) {
    appConfig = _appConfig_;
  }));
});
