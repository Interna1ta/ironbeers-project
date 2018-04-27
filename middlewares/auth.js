'use strict';

const requireAnonymous = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  };
  next();
};

const requireUserSession = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/events');
  };
  next();
};

module.exports = {requireAnonymous, requireUserSession};
