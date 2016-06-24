'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Content = mongoose.model('Content'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a content
 */
exports.create = function (req, res) {
  var content = new Content(req.body);
  content.user = req.user;

  content.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(content);
    }
  });
};

/**
 * Content the current content
 */
exports.read = function (req, res) {
  res.json(req.content);
};

/**
 * Update a content
 */
exports.update = function (req, res) {
  var content = req.content;

  content.title = req.body.title;
  content.headline = req.body.headline;
  content.description = req.body.description;
  content.image = req.body.image;
  content.category = req.body.category;
  content.guest = req.body.guest;
  content.featured = req.body.featured;
  content.links = req.body.links;
  content.regulars = req.body.regulars;
  content.aired = req.body.aired;
  content.belongsToSpecial = req.body.belongsToSpecial;
  content.belongsToRegular = req.body.belongsToRegular;
  content.guests = req.body.guests;

  content.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(content);
    }
  });
};

/**
 * Delete an content
 */
exports.delete = function (req, res) {
  var content = req.content;

  content.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(content);
    }
  });
};

/**
 * List of Contents
 */
exports.list = function (req, res) {
  console.log(req.query);
  Content.find(req.query).sort('-created').populate('user', 'displayName').populate('regulars', 'title').populate('special', 'title').exec(function (err, contents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(contents);
      res.json(contents);
    }
  });
};

/**
 * Content middleware
 */
exports.contentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Content is invalid'
    });
  }

  Content.findById(id).populate('user', 'displayName').populate('regular', 'title').populate('special', 'title').exec(function (err, content) {
    if (err) {
      return next(err);
    } else if (!content) {
      return res.status(404).send({
        message: 'No content with that identifier has been found'
      });
    }
    req.content = content;
    next();
  });
};
