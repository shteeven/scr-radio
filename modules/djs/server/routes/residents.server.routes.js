'use strict';

/**
 * Module dependencies.
 */
var residentsPolicy = require('../policies/residents.server.policy'),
  residents = require('../controllers/residents.server.controller');

module.exports = function (app) {
  // Residents collection routes
  app.route('/api/residents').all(residentsPolicy.isAllowed)
    .get(residents.list)
    .post(residents.create);

  // Single dj routes
  app.route('/api/residents/:djId').all(residentsPolicy.isAllowed)
    .get(residents.read)
    .put(residents.update)
    .delete(residents.delete);

  // Finish by binding the dj middleware
  app.param('djId', residents.djByID);
};
