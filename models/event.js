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
    type: String
  },
  date: {
    type: String
  },
  time: {
    type: String
  },
  picture: {
    type: String
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
