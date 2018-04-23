'use strict';

// -- require npm packages
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const bcryptSalt = 10;

// ---------- SIGN UP ---------- //

// ----- Get ----- //
router.get('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/users/signup');
});

// ----- Post ----- //
router.post('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };

  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    // PLEASE PROVIDE USERNAME
    return res.redirect('/users/signup');
  };

  if (!password) {
    // PLEASE PROVIDE PASSWORD
    return res.redirect('/users/signup');
  }

  User.findOne({ username: username })
    .then(result => {
      if (result) {
        // USERNAME ALREADY TAKEN
        return res.redirect('/users/signup');
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const user = User({
          username,
          password: hashPass
        });
        user.save()
          .then(() => {
            req.session.user = user;
            // WELCOME <USERNAME> ESTE FLASH DEBERIA DESAPARECER CON EL TIEMPO (MAYBE SOME FRONT END JS???)
            return res.redirect('/');
          })
          .catch(next);
      };
    });
});

// ---------- LOGIN ---------- //

// ----- Get ----- //
router.get('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/users/login');
});

// ----- Post ----- //
router.post('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(result => {
      if (!result) {
        return res.redirect('/users/login');
      } else if (bcrypt.compareSync(password, result.password)) {
        req.session.user = result;
        return res.redirect('/');
      } else {
        return res.redirect('/users/login');
      }
    })
    .catch(next);
});

// ---------- LOGOUT ---------- //

router.post('/logout', (req, res, next) => {
  delete req.session.user;
  return res.redirect('/');
});

module.exports = router;
