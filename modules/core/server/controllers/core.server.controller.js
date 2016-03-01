'use strict';

var mongoose = require('mongoose'),
  Dj = mongoose.model('Dj'),
  Show = mongoose.model('Show'),
  Program = mongoose.model('Program'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Get featured shows
 * TODO: refactor this to use a memcache function
 */
exports.getFeatured = function (req, res) {
  var featured = [];
  Dj.find({ featured:true }).exec(function(err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      featured.push.apply(featured, result);
      Program.find({ featured:true }).exec(function(err, result) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          featured.push.apply(featured, result);
          Show.find({ featured:true }).exec(function(err, result) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              featured.push.apply(featured, result);
              res.json(featured);
            }
          });
        }
      });
    }
  });
};


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
