'use strict';

/**
 * Module dependencies.
 */
var specialsPolicy = require('../policies/specials.server.policy'),
  specials = require('../controllers/specials.server.controller');

module.exports = function (app) {
  // Specials collection routes
  app.route('/api/specials').all(specialsPolicy.isAllowed)
    .get(specials.list)
    .post(specials.create);

  // Single special routes
  app.route('/api/specials/:specialId').all(specialsPolicy.isAllowed)
    .get(specials.read)
    .put(specials.update)
    .delete(specials.delete);

  // Finish by binding the special middleware
  app.param('specialId', specials.specialByID);
};
