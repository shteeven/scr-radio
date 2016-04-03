'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Resident = mongoose.model('Resident'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a resident
 */
exports.create = function (req, res) {
  var resident = new Resident(req.body);
  resident.user = req.user;

  resident.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(resident);
    }
  });
};

/**
 * Show the current resident
 */
exports.read = function (req, res) {
  res.json(req.resident);
};

/**
 * Update a resident
 */
exports.update = function (req, res) {
  var resident = req.resident;

  resident.title = req.body.title;
  resident.image = req.body.image;
  resident.images = req.body.images;
  resident.links = req.body.links;
  resident.categories = req.body.categories;
  resident.description = req.body.description;
  resident.guest = req.body.guest;
  resident.featured = req.body.featured;

  resident.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(resident);
    }
  });
};

/**
 * Delete an resident
 */
exports.delete = function (req, res) {
  var resident = req.resident;

  resident.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(resident);
    }
  });
};

/**
 * List of Residents
 */
exports.list = function (req, res) {
  Resident.find().sort('-created').populate('user', 'displayName').exec(function (err, residents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(residents);
    }
  });
};

/**
 * Resident middleware
 */
exports.residentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Resident is invalid'
    });
  }

  Resident.findById(id).populate('user', 'displayName').exec(function (err, resident) {
    if (err) {
      return next(err);
    } else if (!resident) {
      return res.status(404).send({
        message: 'No resident with that identifier has been found'
      });
    }
    req.resident = resident;
    next();
  });
};
