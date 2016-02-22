'use strict';
/* INDIVIDUAL SHOWS */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Show Schema
 */
var ShowSchema = new Schema({
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
  mixcloud: { type: String },
  categories: [ String ],
  description: {
    en: String,
    kr: String
  },
  hostID: [
    {
      type: Schema.ObjectId,
      ref: 'Host'
    }
  ],
  dateTime: {
    type: Date
  },
  length: { type: Number },
  programID: {
    type: Schema.ObjectId,
    ref: 'Program'
  }
});

mongoose.model('Show', ShowSchema);
