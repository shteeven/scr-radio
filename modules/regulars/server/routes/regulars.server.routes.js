'use strict';

/**
 * Module dependencies.
 */
var regularsPolicy = require('../policies/regulars.server.policy'),
  regulars = require('../controllers/regulars.server.controller');

module.exports = function (app) {
  // Regulars collection routes
  app.route('/api/regulars').all(regularsPolicy.isAllowed)
    .get(regulars.list)
    .post(regulars.create);

  // Single regular routes
  app.route('/api/regulars/:regularId').all(regularsPolicy.isAllowed)
    .get(regulars.read)
    .put(regulars.update)
    .delete(regulars.delete);

  // Finish by binding the regular middleware
  app.param('regularId', regulars.regularByID);
};
