'use strict';

describe('Djs E2E Tests:', function () {
  describe('Test djs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localdj:3001/djs');
      expect(element.all(by.repeater('dj in djs')).count()).toEqual(0);
    });
  });
});
