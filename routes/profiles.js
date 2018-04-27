'use strict';

// ------------------------------ MODELS AND PACKAGES REQUIRED ------------------------------ //
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const uploadCloud = require('../config/cloudinary.js');

// ------------------------------ PROFILE SHOW ------------------------------ //
// --------------- GET --------------- //
router.get('/profile', (req, res, next) => {
  const userId = req.session.user._id;
  User.findById(userId)
    .then((result) => {
      const data = {
        user: result
      };
      res.render('pages/profile', data);
    })
    .catch(next);
});

// ------------------------------ PROFILE UPDATE ------------------------------ //
// --------------- GET --------------- //
router.get('/update', (req, res, next) => {
  const userId = req.session.user._id;
  User.findById(userId)
    .then((result) => {
      const data = {
        user: result
      };
      res.render('pages/update', data);
    })
    .catch(next);
});

// --------------- POST --------------- //
router.post('/update', uploadCloud.single('imgPath'), (req, res, next) => {
  const userId = req.session.user._id;
  let data = {};

  console.log(req.file);
  if (req.file) {
    data.imgPath = req.file.url;
    data.imgName = req.file.originalname;
  }
  data.email = req.body.email;
  data.firstName = req.body.firstName;
  data.lastName = req.body.lastName;

  User.findByIdAndUpdate(userId, { $set: { ...data } }, {new: true})
    .then((result) => {
      res.redirect(`/profiles/profile`);
    })
    .catch(next);
});

module.exports = router;
