'use strict';

const routeName = require(`../route-name`);


module.exports = (req, res, next) => {
  res.redirect(`/${routeName.NOT_FOUND}`);
  next();
};
