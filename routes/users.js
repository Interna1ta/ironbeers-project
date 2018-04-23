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
    return res.redirect('/'); // @todo redirect to events
  };

  // @todo read flash 'signup'
  res.render('pages/users/signup');
});

// ----- Post ----- //
router.post('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/'); // @todo redirect to events
  };

  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    // @todo send flash 'signup' PLEASE PROVIDE USERNAME
    return res.redirect('/users/signup');
  };

  if (!password) {
    // @todo send flash 'signup' PLEASE PROVIDE PASSWORD
    return res.redirect('/users/signup');
  }

  User.findOne({ email: email })
    .then(result => {
      if (result) {
        // @todo send flash 'signup' USERNAME ALREADY TAKEN
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
          // @todo WELCOME <USERNAME> ESTE FLASH DEBERIA DESAPARECER CON EL TIEMPO (MAYBE SOME FRONT END JS???)
          return res.redirect('/events');
        });
    })
    .catch(next);
});

// ---------- LOGIN ---------- //

// ----- Get ----- //
router.get('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/'); // @todo redirect to events
  };
  // @todo read flash 'login'
  res.render('pages/users/login');
});

// ----- Post ----- //
router.post('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/'); // @todo redirect to events
  };
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(result => {
      if (!result || !bcrypt.compareSync(password, result.password)) {
        // @todo send flash 'login'
        return res.redirect('/users/login');
      }

      // @todo send flash 'welcome'
      req.session.user = result;
      res.redirect('/events');
    })
    .catch(next);
});

// ---------- LOGOUT ---------- //

router.post('/logout', (req, res, next) => {
  delete req.session.user;
  return res.redirect('/');
});

module.exports = router;
