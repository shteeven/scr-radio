'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Show = mongoose.model('Show'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a show
 */
exports.create = function (req, res) {
  var show = new Show(req.body);
  show.user = req.user;

  show.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(show);
    }
  });
};

/**
 * Show the current show
 */
exports.read = function (req, res) {
  res.json(req.show);
};

/**
 * Update a show
 */
exports.update = function (req, res) {
  var show = req.show;

  show.title = req.body.title;
  show.content = req.body.content;

  show.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(show);
    }
  });
};

/**
 * Delete an show
 */
exports.delete = function (req, res) {
  var show = req.show;

  show.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(show);
    }
  });
};

/**
 * List of Shows
 */
exports.list = function (req, res) {
  Show.find().sort('-created').populate('user', 'displayName').exec(function (err, shows) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shows);
    }
  });
};

/**
 * Show middleware
 */
exports.showByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Show is invalid'
    });
  }

  Show.findById(id).populate('user', 'displayName').exec(function (err, show) {
    if (err) {
      return next(err);
    } else if (!show) {
      return res.status(404).send({
        message: 'No show with that identifier has been found'
      });
    }
    req.show = show;
    next();
  });
};
