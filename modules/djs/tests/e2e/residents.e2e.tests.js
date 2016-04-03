'use strict';

describe('Residents E2E Tests:', function () {
  describe('Test residents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localdj:3001/residents');
      expect(element.all(by.repeater('dj in residents')).count()).toEqual(0);
    });
  });
});
