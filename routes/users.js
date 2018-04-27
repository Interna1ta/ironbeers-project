'use strict';

// ------------------------------ MODELS AND PACKAGES REQUIRED ------------------------------ //
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const middlewaresAuth = require('../middlewares/auth');
const router = express.Router();
const bcryptSalt = 10;

// ------------------------------ SIGN UP ------------------------------ //
// --------------- GET --------------- //
router.get('/signup', middlewaresAuth.requireUserSession, (req, res, next) => {
  const data = {
    messages: req.flash('message-name')
  };
  res.render('pages/users/signup', data);
});

// --------------- POST --------------- //
router.post('/signup', middlewaresAuth.requireUserSession, (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    req.flash('message-name', 'Please provide email');
    return res.redirect('/users/signup');
  };

  if (!password) {
    req.flash('message-name', 'Please provide password');
    return res.redirect('/users/signup');
  }

  User.findOne({ email: email })
    .then(result => {
      if (result) {
        req.flash('message-name', 'Username already taken');
        return res.redirect('/users/signup');
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const user = User({
        email,
        password: hashPass
      });
      return user.save()
        .then(() => {
          req.session.user = user;
          req.flash('message-name', 'Welcome, please update your profile');
          return res.redirect('/events');
        });
    })
    .catch(next);
});

// ------------------------------ LOG IN ------------------------------ //
// --------------- GET --------------- //
router.get('/login', middlewaresAuth.requireUserSession, (req, res, next) => {
  const data = {
    messages: req.flash('message-name')
  };
  res.render('pages/users/login', data);
});

// --------------- POST --------------- //
router.post('/login', middlewaresAuth.requireUserSession, (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(result => {
      if (!result || !bcrypt.compareSync(password, result.password)) {
        req.flash('message-name', 'Email or Password are incorrect');
        return res.redirect('/users/login');
      }

      req.session.user = result;
      res.redirect('/events');
    })
    .catch(next);
});

// ------------------------------ LOG OUT ------------------------------ //
// --------------- POST --------------- //
router.post('/logout', (req, res, next) => {
  delete req.session.user;
  delete req.session.flash;
  return res.redirect('/');
});

module.exports = router;
