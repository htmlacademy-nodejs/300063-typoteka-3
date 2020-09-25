'use strict';

module.exports = (error, req, res, next) => {
  res.redirect(`/internal-server-error`);
  next();
};
