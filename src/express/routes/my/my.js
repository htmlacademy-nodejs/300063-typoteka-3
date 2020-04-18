'use strict';

const {Router} = require(`express`);

const commentsRoute = require(`./comments`);

const myRoute = new Router();

myRoute.use(`/comments`, commentsRoute);
myRoute.get(`/`, (req, res) => res.send(`/my`));

module.exports = myRoute;
