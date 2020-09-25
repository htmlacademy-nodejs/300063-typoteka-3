'use strict';

module.exports = (req, res, next) => {
  res.redirect(`/not-found`);
  next();
};
