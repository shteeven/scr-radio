'use strict';

/**
 * Module dependencies.
 */
var contentsPolicy = require('../policies/contents.server.policy'),
  contents = require('../controllers/contents.server.controller');

module.exports = function (app) {
  // Contents collection routes
  app.route('/api/contents').all(contentsPolicy.isAllowed)
    .get(contents.list)
    .post(contents.create);

  // Single content routes
  app.route('/api/contents/:contentId').all(contentsPolicy.isAllowed)
    .get(contents.read)
    .put(contents.update)
    .delete(contents.delete);

  // Finish by binding the content middleware
  app.param('contentId', contents.contentByID);
};
