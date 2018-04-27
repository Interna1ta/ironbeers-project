'use strict';

// ------------------------------ MODELS AND PACKAGES REQUIRED ------------------------------ //
const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const uploadCloud = require('../config/cloudinary.js');
const middlewaresAuth = require('../middlewares/auth');
const moment = require('moment');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const router = express.Router();

// ------------------------------ LIST INDEX ------------------------------ //
// --------------- GET --------------- //
router.get('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  const user = req.session.user;

  const promiseFindGuest = Event.find({ guests: { $in: [user._id] }, active: true }).populate('guests');
  const promiseFindOwner = Event.find({ owner: user, active: true }).populate('owner');

  Promise.all([promiseFindGuest, promiseFindOwner])
    .then((result) => {
      const events = result[0].concat(result[1]);
      const data = {
        events,
        messages: req.flash('message-name')
      };
      res.render('pages/events/index', data);
    })
    .catch(next);
});

// ------------------------------ CREATE ------------------------------ //
// --------------- GET --------------- //
router.get('/create', middlewaresAuth.requireAnonymous, (req, res, next) => {
  res.render('pages/events/new');
});

// --------------- POST --------------- //
router.post('/', middlewaresAuth.requireAnonymous, uploadCloud.single('imgPath'), (req, res, next) => {
  let location = {
    type: 'Point',
    address: req.body.address,
    coordinates: [req.body.longitude, req.body.latitude],
    name: req.body.name,
    vicinity: req.body.vicinity
  };

  const event = new Event(req.body);
  event.owner = req.session.user;
  event.date = moment(req.body.date).format('dddd[, ]MMMM Do');
  if (req.file) {
    event.imgPath = req.file.url;
    event.imgName = req.file.name;
  };
  event.location = location;
  event.save()
    .then(() => {
      res.redirect(`/events/${event._id}`);
    })
    .catch(next);
});

// ------------------------------ SHOW EVENT ------------------------------ //
// --------------- GET --------------- //
router.get('/:id', middlewaresAuth.requireAnonymous, (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId).populate('owner').populate('guests')
    .then((result) => {
      const data = {
        event: result
      };
      res.render('pages/events/show', data);
    })
    .catch(next);
});

// ------------------------------ UPDATE EVENT ------------------------------ //
// --------------- GET --------------- //
router.get('/:id/edit', middlewaresAuth.requireAnonymous, (req, res, next) => {
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

// --------------- POST --------------- //
router.post('/:id', middlewaresAuth.requireAnonymous, uploadCloud.single('imgPath'), (req, res, next) => {
  const eventId = req.params.id;
  let data = {};

  if (req.file) {
    data.imgPath = req.file.url;
    data.imgName = req.file.originalname;
  }
  data.email = req.body.email;
  data.firstName = req.body.firstName;
  data.lastName = req.body.lastName;
  data.title = req.body.title;
  data.description = req.body.description;
  data.location = req.body.location;
  data.date = req.body.date;
  data.time = req.body.time;

  Event.findOneAndUpdate(eventId, { $set: { ...data } })
    .then(() => {
      res.redirect(`/events/${eventId}`);
    })
    .catch(next);
});

// ------------------------------ CANCEL EVENT ------------------------------ //
// --------------- POST --------------- //
router.post('/:id/cancel', middlewaresAuth.requireAnonymous, (req, res, next) => {
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

// ------------------------------ INVITE EVENT ------------------------------ //
// --------------- GET --------------- //
router.get('/:id/invite', middlewaresAuth.requireAnonymous, (req, res, next) => {
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

// --------------- POST --------------- //
router.post('/:id/invite', (req, res, next) => {
  const eventId = req.params.id;
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
    html: `
    <h1>
    <a href=${message}>accept invitation</a>`
  })
    // .then(info => res.render('message', { email, message, info }))
    .then(info => res.redirect(`/events/${eventId}`))
    .catch(error => console.log(error));
});

// ------------------------------ ACCEPT EVENT ------------------------------ //
// --------------- GET --------------- //
router.get('/:id/accept', (req, res, next) => {
  const eventId = req.params.id;
  Event.findById(eventId)
    .then((result) => {
      const data = {
        event: result,
        messages: req.flash('message-name')
      };
      res.render('pages/events/accept', data);
    })
    .catch(next);
});

// --------------- POST --------------- //
router.post('/:id/accept', (req, res, next) => {
  const eventId = req.params.id;
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    req.flash('message-name', 'Please provide email');
    return res.redirect(`/events/${eventId}/accept`);
  };

  if (!password) {
    req.flash('message-name', 'Please provide password');
    return res.redirect(`/events/${eventId}/accept`);
  }

  User.findOne({ email: email })
    .then(result => {
      if (result) {
        req.flash('message-name', 'Email already taken');
        return res.redirect(`/events/${eventId}/accept`);
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

          Event.findByIdAndUpdate(eventId, { $push: { guests: [user._id] } })
            .then(() => {
              return res.redirect(`/events/${eventId}`);
            })
            .catch(next);

          return res.redirect(`/events/${eventId}`);
        });
    })
    .catch(next);
});

// ------------------------------ IGNORE EVENT ------------------------------ //
// --------------- POST --------------- //
router.post('/:id/ignore', (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.body.user;

  Event.findByIdAndUpdate(eventId, { $pull: { guests: userId } })
    .then((result) => {
      return res.redirect('/events');
    })
    .catch(next);
});

module.exports = router;
