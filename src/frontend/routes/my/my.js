'use strict';

const {Router} = require(`express`);

const commentsRoute = require(`./comments`);
const {getMyPage} = require(`./methods`);


const myRoute = new Router();

myRoute.use(`/comments`, commentsRoute);
myRoute.get(`/`, getMyPage);

module.exports = myRoute;
