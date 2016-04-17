'use strict';
/* HOSTS AND CONTENT CREATORS */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var Thingschema = new Schema({
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
  heading: {
    type: String,
    trim: true
  },
  description: {
    en: String,
    kr: String
  },
  resourceType: {
    type: String,
    trim: true
  },
  resource: {
    type: Schema.ObjectId
  },
  image: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  links: {
    mixcloud: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    home: { type: String },
    instagram: { type: String }
  },
  category: {
    type: String,
    trim: true
  }
});

mongoose.model('Thing', Thingschema);
