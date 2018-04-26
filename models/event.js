'use strict';

// -- require npm packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  guests: [{
    type: ObjectId,
    ref: 'User'
  }],
  location: {
    address: String,
    type: { type: String },
    coordinates: [Number]
  },
  date: {
    type: String
  },
  time: {
    type: String
  },
  imgPath: {
    type: String
  },
  imgName: {
    type: String
  },
  pictures: [{
    imgPath: String,
    imgName: String
  }],
  active: {
    type: Boolean,
    default: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
