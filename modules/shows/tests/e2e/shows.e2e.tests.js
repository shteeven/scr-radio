'use strict';

describe('Shows E2E Tests:', function () {
  describe('Test shows page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localshow:3001/shows');
      expect(element.all(by.repeater('show in shows')).count()).toEqual(0);
    });
  });
});
