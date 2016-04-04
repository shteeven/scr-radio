'use strict';

describe('Things E2E Tests:', function () {
  describe('Test things page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localthing:3001/things');
      expect(element.all(by.repeater('thing in things')).count()).toEqual(0);
    });
  });
});
