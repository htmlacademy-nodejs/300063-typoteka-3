'use strict';

const {Router} = require(`express`);

const commentsRoute = new Router();

commentsRoute.get(`/`, (req, res) => res.send(`/my/comments`));

module.exports = commentsRoute;
