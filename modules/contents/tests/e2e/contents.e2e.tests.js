'use strict';

describe('Contents E2E Tests:', function () {
  describe('Test contents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localcontent:3001/contents');
      expect(element.all(by.repeater('content in contents')).count()).toEqual(0);
    });
  });
});
