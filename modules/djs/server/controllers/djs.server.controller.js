'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dj = mongoose.model('Dj'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a dj
 */
exports.create = function (req, res) {
  var dj = new Dj(req.body);
  console.log(req.user);
  dj.user = req.user;

  dj.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dj);
    }
  });
};

/**
 * Show the current dj
 */
exports.read = function (req, res) {
  res.json(req.dj);
};

/**
 * Update a dj
 */
exports.update = function (req, res) {
  var dj = req.dj;

  dj.title = req.body.title;
  dj.image = req.body.image;
  dj.images = req.body.images;
  dj.links = req.body.links;
  dj.categories = req.body.categories;
  dj.description = req.body.description;
  dj.guest = req.body.guest;
  dj.featured = req.body.featured;

  dj.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dj);
    }
  });
};

/**
 * Delete an dj
 */
exports.delete = function (req, res) {
  var dj = req.dj;

  dj.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dj);
    }
  });
};

/**
 * List of Djs
 */
exports.list = function (req, res) {
  Dj.find().sort('-created').populate('user', 'displayName').exec(function (err, djs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(djs);
    }
  });
};

/**
 * Dj middleware
 */
exports.djByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dj is invalid'
    });
  }

  Dj.findById(id).populate('user', 'displayName').exec(function (err, dj) {
    if (err) {
      return next(err);
    } else if (!dj) {
      return res.status(404).send({
        message: 'No dj with that identifier has been found'
      });
    }
    req.dj = dj;
    next();
  });
};
