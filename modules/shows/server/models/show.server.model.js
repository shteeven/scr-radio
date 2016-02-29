'use strict';
/* HOSTS AND CONTENT CREATORS */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Show Schema
 */
var Showschema = new Schema({
  // admin data
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  // display data
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  image: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  images: [ String ],
  links: {
    mixcloud: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    homepage: { type: String },
    instagram: { type: String }
  },
  categories: [ String ],
  description: {
    en: String,
    kr: String
  },
  djs: [ {
    type: Schema.ObjectId,
    ref: 'Dj'
  } ],
  guests: [ {
    type: Schema.ObjectId,
    ref: 'Dj'
  } ],
  aired: { type: Date },
  featured: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Show', Showschema);
