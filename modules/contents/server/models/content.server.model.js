'use strict';
/* HOSTS AND CONTENT CREATORS */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Content Schema
 */
var Contentschema = new Schema({
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
  headline: {
    en: String,
    kr: String
  },
  description: {
    en: String,
    kr: String
  },
  image: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  category: String,
  guest: {
    type: Boolean
  },
  featured: [ String ], // where it will be featured
  links: {
    mixcloud: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    home: { type: String },
    external: { type: String },
    instagram: { type: String }
  },
  aired: {
    type: Date
  },
  belongsToRegular: [ // what is this object a child of 
    {
      type: Schema.ObjectId,
      ref: 'Content'
    }
  ],
  belongsToSpecial: [ // what is this object a child of 
    {
      type: Schema.ObjectId,
      ref: 'Content'
    }
  ],
  guests: [ { // what regulars/guests made a guest appearance on this epidsode
    type: Schema.ObjectId,
    ref: 'Content'
  } ]
});

mongoose.model('Content', Contentschema);
