'use strict';

describe('Stars E2E Tests:', function () {
  describe('Test stars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localstar:3001/stars');
      expect(element.all(by.repeater('star in stars')).count()).toEqual(0);
    });
  });
});
