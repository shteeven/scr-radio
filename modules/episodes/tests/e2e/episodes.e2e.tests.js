'use strict';

describe('Episodes E2E Tests:', function () {
  describe('Test episodes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localepisode:3001/episodes');
      expect(element.all(by.repeater('episode in episodes')).count()).toEqual(0);
    });
  });
});
