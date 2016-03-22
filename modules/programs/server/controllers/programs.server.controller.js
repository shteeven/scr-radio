'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Program = mongoose.model('Program'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a program
 */
exports.create = function (req, res) {
  var program = new Program(req.body);
  program.user = req.user;

  program.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(program);
    }
  });
};

/**
 * Show the current program
 */
exports.read = function (req, res) {
  res.json(req.program);
};

/**
 * Update a program
 */
exports.update = function (req, res) {
  var program = req.program;

  program.title = req.body.title;
  program.image = req.body.image;
  program.images = req.body.images;
  program.links = req.body.links;
  program.categories = req.body.categories;
  program.description = req.body.description;
  program.djs = req.body.djs;
  program.schedule = req.body.schedule;
  program.featured = req.body.featured;

  program.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(program);
    }
  });
};

/**
 * Delete an program
 */
exports.delete = function (req, res) {
  var program = req.program;

  program.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(program);
    }
  });
};

/**
 * List of Programs
 */
exports.list = function (req, res) {
  if (req.query.djId) {
    Program.find({ djs: req.query.djId }, { title: 1, image: 1 }).limit(5).sort('-created').exec(function (err, programs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(programs);
      }
    });
  } else {
    Program.find().sort('-created').populate('user', 'displayName').populate('djs', 'title').exec(function (err, programs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(programs);
      }
    });
  }
};

/**
 * Program middleware
 */
exports.programByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Program is invalid'
    });
  }

  Program.findById(id).populate('user', 'displayName').populate('djs', 'title').exec(function (err, program) {
    if (err) {
      return next(err);
    } else if (!program) {
      return res.status(404).send({
        message: 'No program with that identifier has been found'
      });
    }
    req.program = program;
    next();
  });
};

//exports.programByDjID = function (req, res, next, id) {
//
//  console.log(reg);
//
//  if (!mongoose.Types.ObjectId.isValid(id)) {
//    return res.status(400).send({
//      message: 'Program is invalid'
//    });
//  }
//
//  Program.find({djs: id}, {title: 1, image: 1, links: 1}).exec(function (err, program) {
//    if (err) {
//      return next(err);
//    } else if (!program) {
//      return res.status(404).send({
//        message: 'No program with that identifier has been found'
//      });
//    }
//    req.program = program;
//    next();
//  });
//};
