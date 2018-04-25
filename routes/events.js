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

  Event.find({ owner: owner, active: true }).populate('owner', 'email -_id')
    .then((result) => {
      const data = {
        events: result,
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

  let location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };

  const event = new Event(req.body);
  event.owner = req.session.user;
  event.location = location;
  event.save()
    .then(() => {
      // res.redirect(`/events/${event._id}`);
      res.redirect(`/`);
    })
    .catch(next);
});
// ---------- SHOW EVENT ---------- //

// ----- Get ----- //
router.get('/:id', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const eventId = req.params.id;
  Event.findById(eventId).populate('owner')
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/events/show', data);
    })
    .catch(next);
});

// ---------- UPDATE EVENT ---------- //

// ----- Get ----- //
router.get('/:id/edit', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/events/edit', data);
    })
    .catch(next);
});

// ----- Post ----- //
router.post('/:id', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const eventId = req.params.id;
  const data = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    date: req.body.date,
    time: req.body.time,
    picture: req.body.picture
  };
  Event.findOneAndUpdate(eventId, { $set: { ...data } })
    .then(() => {
      res.redirect(`/events/${eventId}`);
    })
    .catch(next);
});

// ---------- CANCEL EVENT ---------- //

// ----- Post ----- //
router.post('/:id/cancel', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const eventId = req.params.id;
  const data = {
    active: false
  };
  Event.findByIdAndUpdate(eventId, { $set: { ...data } }, {new: true})
    .then(() => {
      res.redirect(`/`);
    })
    .catch(next);
});

// ---------- INVITE EVENT ---------- //

// ----- Post ----- //

module.exports = router;
