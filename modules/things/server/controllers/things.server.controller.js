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
  thing.headline = req.body.headline;
  thing.description = req.body.description;
  thing.resourceType = req.body.resourceType;
  thing.resourceId = req.body.resourceId;
  thing.image = req.body.image;
  thing.links = req.body.links;
  thing.category = req.body.category;
  thing.priority = req.body.priority;

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

  var query = {};

  var type = req.query.type || null;
  var category = req.query.category || null;
  if (type) {
    query.type = type;
  }
  if (category) {
    query.category = category;
  }

  Thing.find(query).sort([['created', -1], ['priority', 1]]).populate('user', 'displayName').exec(function (err, things) {
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
