'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Thing = mongoose.model('Thing'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a thing
 */
exports.create = function (req, res) {
  var thing = new Thing(req.body);
  thing.user = req.user;

  thing.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(thing);
    }
  });
};

/**
 * Show the current thing
 */
exports.read = function (req, res) {
  res.json(req.thing);
};

/**
 * Update a thing
 */
exports.update = function (req, res) {
  var thing = req.thing;

  thing.title = req.body.title;
  thing.image = req.body.image;
  thing.images = req.body.images;
  thing.links = req.body.links;
  thing.categories = req.body.categories;
  thing.description = req.body.description;
  thing.guest = req.body.guest;
  thing.featured = req.body.featured;

  thing.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(thing);
    }
  });
};

/**
 * Delete an thing
 */
exports.delete = function (req, res) {
  var thing = req.thing;

  thing.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(thing);
    }
  });
};

/**
 * List of Things
 */
exports.list = function (req, res) {
  Thing.find().sort('-created').populate('user', 'displayName').exec(function (err, things) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(things);
    }
  });
};

/**
 * Thing middleware
 */
exports.thingByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Thing is invalid'
    });
  }

  Thing.findById(id).populate('user', 'displayName').exec(function (err, thing) {
    if (err) {
      return next(err);
    } else if (!thing) {
      return res.status(404).send({
        message: 'No thing with that identifier has been found'
      });
    }
    req.thing = thing;
    next();
  });
};
