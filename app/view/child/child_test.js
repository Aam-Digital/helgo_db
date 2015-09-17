'use strict';

describe('myApp.view.child module', function() {

  beforeEach(module('myApp.view.child'));

  describe('child controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('ChildListController');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});
