'use strict';

// -- require npm packages
const express = require('express');
const User = require('../models/user');
const Event = require('../models/event');
const router = express.Router();

// ---------- LIST INDEX ---------- //

// ----- Get ----- //
router.get('/', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/users/login');
});

// ---------- CREATE ---------- //

// ----- Get ----- //
router.get('/', (req, res, next) => {

});

// ----- Post ----- //

// ---------- SHOW EVENT ---------- //

// ----- Get ----- //

// ---------- UPDATE EVENT ---------- //

// ----- Get ----- //

// ----- Post ----- //

// ---------- CANCEL EVENT ---------- //

// ----- Post ----- //

// ---------- INVITE EVENT ---------- //

// ----- Post ----- //

module.exports = router;
