'use strict';

// -- require npm packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String
    // required: true
  },
  lastName: {
    type: String
    // required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  imgPath: {
    type: String
  },
  imgName: {
    type: String
  }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
