'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Star = mongoose.model('Star'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a star
 */
exports.create = function (req, res) {
  var star = new Star(req.body);
  star.user = req.user;

  star.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(star);
    }
  });
};

/**
 * Show the current star
 */
exports.read = function (req, res) {
  res.json(req.star);
};

/**
 * Update a star
 */
exports.update = function (req, res) {
  var star = req.star;

  star.title = req.body.title;
  star.content = req.body.content;

  star.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(star);
    }
  });
};

/**
 * Delete an star
 */
exports.delete = function (req, res) {
  var star = req.star;

  star.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(star);
    }
  });
};

/**
 * List of Stars
 */
exports.list = function (req, res) {
  Star.find().sort('-created').populate('user', 'displayName').exec(function (err, stars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(stars);
    }
  });
};

/**
 * Star middleware
 */
exports.starByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Star is invalid'
    });
  }

  Star.findById(id).populate('user', 'displayName').exec(function (err, star) {
    if (err) {
      return next(err);
    } else if (!star) {
      return res.status(404).send({
        message: 'No star with that identifier has been found'
      });
    }
    req.star = star;
    next();
  });
};
