'use strict';

describe('Specials E2E Tests:', function () {
  describe('Test specials page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localspecial:3001/specials');
      expect(element.all(by.repeater('special in specials')).count()).toEqual(0);
    });
  });
});
