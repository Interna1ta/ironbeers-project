'use strict';

// ------------------------------ PACKAGES REQUIRED ------------------------------ //
const express = require('express');
const middlewaresAuth = require('../middlewares/auth');
const router = express.Router();

// ------------------------------ HOMEPAGE ------------------------------ //
// --------------- GET --------------- //
router.get('/', middlewaresAuth.requireUserSession, (req, res, next) => {
  res.render('pages/index');
});

module.exports = router;
