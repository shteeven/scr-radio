'use strict';

/**
 * Module dependencies.
 */
var starsPolicy = require('../policies/stars.server.policy'),
  stars = require('../controllers/stars.server.controller');

module.exports = function (app) {
  // Stars collection routes
  app.route('/api/stars').all(starsPolicy.isAllowed)
    .get(stars.list)
    .post(stars.create);

  // Single star routes
  app.route('/api/stars/:starId').all(starsPolicy.isAllowed)
    .get(stars.read)
    .put(stars.update)
    .delete(stars.delete);

  // Finish by binding the star middleware
  app.param('starId', stars.starByID);
};
