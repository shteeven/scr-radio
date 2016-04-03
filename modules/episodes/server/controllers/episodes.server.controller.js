'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Episode = mongoose.model('Episode'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a episode
 */
exports.create = function (req, res) {
  var episode = new Episode(req.body);
  episode.user = req.user;

  episode.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(episode);
    }
  });
};

/**
 * Episode the current episode
 */
exports.read = function (req, res) {
  res.json(req.episode);
};

/**
 * Update a episode
 */
exports.update = function (req, res) {
  var episode = req.episode;

  episode.title = req.body.title;
  episode.image = req.body.image;
  episode.images = req.body.images;
  episode.links = req.body.links;
  episode.categories = req.body.categories;
  episode.description = req.body.description;
  episode.residents = req.body.residents;
  episode.guests = req.body.guests;
  episode.aired = req.body.aired;
  episode.program = req.body.program;
  episode.featured = req.body.featured;

  episode.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(episode);
    }
  });
};

/**
 * Delete an episode
 */
exports.delete = function (req, res) {
  var episode = req.episode;

  episode.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(episode);
    }
  });
};

/**
 * List of Episodes
 */
exports.list = function (req, res) {
  if (req.query.residentId) {
    Episode.find({ residents: req.query.residentId }).sort('-created').populate('program', 'title').exec(function (err, episodes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(episodes);
      }
    });
  } else {
    Episode.find().sort('-created').populate('user', 'displayName').populate('residents', 'title').populate('program', 'title').exec(function (err, episodes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(episodes);
      }
    });
  }
};

/**
 * Episode middleware
 */
exports.episodeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Episode is invalid'
    });
  }

  Episode.findById(id).populate('user', 'displayName').populate('resident', 'title').populate('program', 'title').exec(function (err, episode) {
    if (err) {
      return next(err);
    } else if (!episode) {
      return res.status(404).send({
        message: 'No episode with that identifier has been found'
      });
    }
    req.episode = episode;
    next();
  });
};
