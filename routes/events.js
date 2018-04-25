'use strict';

// -- require npm packages
const express = require('express');
const Event = require('../models/event');
const uploadCloud = require('../config/cloudinary.js');
const moment = require('moment');
const nodemailer = require('nodemailer');
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
        messages: req.flash('message-name')
      };
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
router.post('/', uploadCloud.single('imgPath'), (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };

  const event = new Event(req.body);
  event.owner = req.session.user;
  event.date = moment(req.body.date).format('dddd[, ]MMMM Do');
  event.imgPath = req.file.url;
  event.imgName = req.file.name;
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
router.post('/:id', uploadCloud.single('imgPath'), (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const eventId = req.params.id;
  let data;

  if (req.file) {
    data = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      imgPath: req.file.url,
      imgName: req.file.originalname
    };
  } else {
    data = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time
    };
  }
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

// ----- get ----- //
router.get('/:id/invite', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/events/invite', data);
    })
    .catch(next);
});

// ----- Post ----- //

router.post('/:id/invite', (req, res, next) => {
  let { email, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ironbeers.invite@gmail.com',
      pass: 'ironbeers1234'
    }
  });
  transporter.sendMail({
    from: '"IRON BEERS 🍻" <ironbeers.invite@gmail.com>',
    to: email,
    subject: 'You have an invitation',
    text: message,
    html: `<b>${message}</b>`
  })
    .then(info => res.render('message', { email, message, info }))
    .catch(error => console.log(error));
});

// ---------- ACCEPT EVENT ---------- //

// ----- get ----- //
router.get('/:id/accept', (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/events/accept', data);
    })
    .catch(next);
});

// ----- Post ----- //

router.post('/:id/accept', (req, res, next) => {
  let { email, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ironbeers.invite@gmail.com',
      pass: 'ironbeers1234'
    }
  });
  transporter.sendMail({
    from: '"IRON BEERS 🍻" <ironbeers.invite@gmail.com>',
    to: email,
    subject: 'You have an invitation',
    text: message,
    html: `<b>${message}</b>`
  })
    .then(info => res.render('message', { email, message, info }))
    .catch(error => console.log(error));
});

module.exports = router;
