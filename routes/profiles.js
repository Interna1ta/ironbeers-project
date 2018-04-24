'use strict';

// -- require npm packages
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// ----- Get ----- //
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

// ----- Get ----- //
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

// ----- Post ----- //
router.post('/update', (req, res, next) => {
  const userId = req.session.user._id;
  const data = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    picture: req.body.picture
  };
  User.findByIdAndUpdate(userId, { $set: { ...data } }, {new: true})
    .then((result) => {
      console.log(result);
      res.redirect(`/profile`);
    })
    .catch(next);
});

module.exports = router;
