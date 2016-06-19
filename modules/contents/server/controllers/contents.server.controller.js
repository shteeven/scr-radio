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
  content.image = req.body.image;
  content.images = req.body.images;
  content.links = req.body.links;
  content.categories = req.body.categories;
  content.description = req.body.description;
  content.regulars = req.body.regulars;
  content.guests = req.body.guests;
  content.aired = req.body.aired;
  content.special = req.body.special;
  content.featured = req.body.featured;

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
  if (req.query.regularId) {
    Content.find({ regulars: req.query.regularId }).sort('-created').populate('special', 'title').exec(function (err, contents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(contents);
      }
    });
  } else if (req.query.specialId) {
    Content.find({ special: req.query.specialId }).sort('-created').populate('regulars', 'title').exec(function (err, contents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(contents);
      }
    });
  } else {
    Content.find().sort('-created').populate('user', 'displayName').populate('regulars', 'title').populate('special', 'title').exec(function (err, contents) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(contents);
      }
    });
  }
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
