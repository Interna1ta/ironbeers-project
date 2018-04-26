'use strict';

require('dotenv').config();

// ------------------------------ NPM PACKAGES ------------------------------ //
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const cloudinary = require('cloudinary').v2;

// ------------------------------ SETUP ROUTES ------------------------------ //
const index = require('./routes/index');
const users = require('./routes/users');
const events = require('./routes/events');
const profiles = require('./routes/profiles');

// ------------------------------ SETUP THE APP ------------------------------ //
const app = express();

// ------------------------------ VIEW ENGINE SETUP ------------------------------ //
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ------------------------------ COOKIES AND SESSIONS ------------------------------ //
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 30 * 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// ------------------------------ CONNECT THE DATABASE ------------------------------ //
mongoose.connect(process.env.MONGODB_URI);

// ------------------------------ MIDDLEWARES ------------------------------ //
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts); // EJS layouts
app.use((req, res, next) => {
  app.locals.currentUser = req.session.user;
  res.locals.cloudinary = cloudinary;
  console.log('USER SESSION', req.session.id);
  next();
});
app.use(flash()); // Flash messages

// ------------------------------ ROUTES ------------------------------ //
app.use('/', index);
app.use('/users', users);
app.use('/events', events);
app.use('/profiles', profiles);

// ------------------------------ 404 AND 500 ERROR HANDLER ------------------------------ //
// NOTE: requires a views/not-found.ejs template
app.use((req, res, next) => {
  res.status(404);
  res.render('pages/errors/404');
});

// NOTE: requires a views/error.ejs template
app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('pages/errors/500');
  }
});

module.exports = app;
