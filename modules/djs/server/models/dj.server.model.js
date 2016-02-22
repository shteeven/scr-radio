'use strict';
/* HOSTS AND CONTENT CREATORS */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Dj Schema
 */
var Djschema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  images: [ String ],
  categories: [ String ],
  description: {
    en: String,
    kr: String
  },
  userID: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  social: {
    mixcloud: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    homepage: { type: String }
  }
});

mongoose.model('Dj', Djschema);
