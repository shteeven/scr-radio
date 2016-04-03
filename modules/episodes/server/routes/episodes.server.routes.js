'use strict';

/**
 * Module dependencies.
 */
var episodesPolicy = require('../policies/episodes.server.policy'),
  episodes = require('../controllers/episodes.server.controller');

module.exports = function (app) {
  // Episodes collection routes
  app.route('/api/episodes').all(episodesPolicy.isAllowed)
    .get(episodes.list)
    .post(episodes.create);

  // Single episode routes
  app.route('/api/episodes/:episodeId').all(episodesPolicy.isAllowed)
    .get(episodes.read)
    .put(episodes.update)
    .delete(episodes.delete);

  // Finish by binding the episode middleware
  app.param('episodeId', episodes.episodeByID);
};
