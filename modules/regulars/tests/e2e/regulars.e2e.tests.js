'use strict';

describe('Regulars E2E Tests:', function () {
  describe('Test regulars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localregular:3001/regulars');
      expect(element.all(by.repeater('regular in regulars')).count()).toEqual(0);
    });
  });
});
