'use strict';

/**
 * Module dependencies.
 */
var showsPolicy = require('../policies/shows.server.policy'),
  shows = require('../controllers/shows.server.controller');

module.exports = function (app) {
  // Shows collection routes
  app.route('/api/shows').all(showsPolicy.isAllowed)
    .get(shows.list)
    .post(shows.create);

  // Single show routes
  app.route('/api/shows/:showId').all(showsPolicy.isAllowed)
    .get(shows.read)
    .put(shows.update)
    .delete(shows.delete);

  // Finish by binding the show middleware
  app.param('showId', shows.showByID);
};
