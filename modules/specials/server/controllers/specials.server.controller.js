'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Special = mongoose.model('Special'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a special
 */
exports.create = function (req, res) {
  var special = new Special(req.body);
  special.user = req.user;

  special.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(special);
    }
  });
};

/**
 * Show the current special
 */
exports.read = function (req, res) {
  res.json(req.special);
};

/**
 * Update a special
 */
exports.update = function (req, res) {
  var special = req.special;

  special.title = req.body.title;
  special.image = req.body.image;
  special.images = req.body.images;
  special.links = req.body.links;
  special.categories = req.body.categories;
  special.description = req.body.description;
  special.regulars = req.body.regulars;
  special.schedule = req.body.schedule;
  special.featured = req.body.featured;

  special.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(special);
    }
  });
};

/**
 * Delete an special
 */
exports.delete = function (req, res) {
  var special = req.special;

  special.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(special);
    }
  });
};

/**
 * List of Specials
 */
exports.list = function (req, res) {
  if (req.query.regularId) {
    Special.find({ regulars: req.query.regularId }, { title: 1, image: 1 }).limit(5).sort('-created').exec(function (err, specials) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(specials);
      }
    });
  } else {
    Special.find().sort('-created').populate('user', 'displayName').populate('regulars', 'title').exec(function (err, specials) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(specials);
      }
    });
  }
};

/**
 * Special middleware
 */
exports.specialByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Special is invalid'
    });
  }

  Special.findById(id).populate('user', 'displayName').populate('regulars', 'title').exec(function (err, special) {
    if (err) {
      return next(err);
    } else if (!special) {
      return res.status(404).send({
        message: 'No special with that identifier has been found'
      });
    }
    req.special = special;
    next();
  });
};

//exports.specialByRegularID = function (req, res, next, id) {
//
//  console.log(reg);
//
//  if (!mongoose.Types.ObjectId.isValid(id)) {
//    return res.status(400).send({
//      message: 'Special is invalid'
//    });
//  }
//
//  Special.find({regulars: id}, {title: 1, image: 1, links: 1}).exec(function (err, special) {
//    if (err) {
//      return next(err);
//    } else if (!special) {
//      return res.status(404).send({
//        message: 'No special with that identifier has been found'
//      });
//    }
//    req.special = special;
//    next();
//  });
//};
