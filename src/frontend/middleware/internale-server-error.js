'use strict';

const routeName = require(`../route-name`);

module.exports = (error, req, res, next) => {
  res.redirect(`/${routeName.INTERNAL_SERVER_ERROR}`);
  next();
};
