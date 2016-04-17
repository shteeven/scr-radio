'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Regular = mongoose.model('Regular'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a regular
 */
exports.create = function (req, res) {
  var regular = new Regular(req.body);
  regular.user = req.user;

  regular.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(regular);
    }
  });
};

/**
 * Show the current regular
 */
exports.read = function (req, res) {
  res.json(req.regular);
};

/**
 * Update a regular
 */
exports.update = function (req, res) {
  var regular = req.regular;

  regular.title = req.body.title;
  regular.image = req.body.image;
  regular.images = req.body.images;
  regular.links = req.body.links;
  regular.categories = req.body.categories;
  regular.description = req.body.description;
  regular.guest = req.body.guest;
  regular.featured = req.body.featured;

  regular.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(regular);
    }
  });
};

/**
 * Delete an regular
 */
exports.delete = function (req, res) {
  var regular = req.regular;

  regular.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(regular);
    }
  });
};

/**
 * List of Regulars
 */
exports.list = function (req, res) {
  Regular.find().sort('-created').populate('user', 'displayName').exec(function (err, regulars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(regulars);
    }
  });
};

/**
 * Regular middleware
 */
exports.regularByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Regular is invalid'
    });
  }

  Regular.findById(id).populate('user', 'displayName').exec(function (err, regular) {
    if (err) {
      return next(err);
    } else if (!regular) {
      return res.status(404).send({
        message: 'No regular with that identifier has been found'
      });
    }
    req.regular = regular;
    next();
  });
};
