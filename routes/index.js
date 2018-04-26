'use strict';

// ------------------------------ PACKAGES REQUIRED ------------------------------ //
const express = require('express');
const router = express.Router();

// ------------------------------ HOMEPAGE ------------------------------ //
// --------------- GET --------------- //
router.get('/', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/events');
  };
  res.render('pages/index');
});

module.exports = router;
