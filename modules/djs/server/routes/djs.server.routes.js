'use strict';

/**
 * Module dependencies.
 */
var djsPolicy = require('../policies/djs.server.policy'),
  djs = require('../controllers/djs.server.controller');

module.exports = function (app) {
  // Djs collection routes
  app.route('/api/djs').all(djsPolicy.isAllowed)
    .get(djs.list)
    .post(djs.create);

  // Single dj routes
  app.route('/api/djs/:djId').all(djsPolicy.isAllowed)
    .get(djs.read)
    .put(djs.update)
    .delete(djs.delete);

  // Finish by binding the dj middleware
  app.param('djId', djs.djByID);
};
