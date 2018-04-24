'use strict';

// -- require npm packages
const express = require('express');
// const User = require('../models/user');
const Event = require('../models/event');
const router = express.Router();

// ---------- LIST INDEX ---------- //

// ----- Get ----- //
router.get('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const owner = req.session.user;

  Event.find({ owner: owner }).populate('owner', 'email -_id')
    .then((result) => {
      const data = { events: result,
        messages: req.flash('message-name'
        )};
      res.render('pages/events/index', data);
    })
    .catch(next);
});

// ---------- CREATE ---------- //

// ----- Get ----- //
router.get('/create', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  // @todo read flash const data = { messages: req.flash('welcome') }
  res.render('pages/events/new');
});

// ----- Post ----- //
router.post('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };

  const event = new Event(req.body);
  event.owner = req.session.user;
  event.save()
    .then(() => {
      // res.redirect(`/events/${event._id}`);
      res.redirect(`/`);
    })
    .catch(next);
});
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
