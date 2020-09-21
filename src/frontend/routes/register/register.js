'use strict';

const {Router} = require(`express`);

const {queryParamsMiddleware} = require(`../../middleware`);
const {upload} = require(`../../utils`);
const {getRegisterPage, postRegisterPage} = require(`./methods`);


const registerRoute = new Router();

registerRoute.get(`/`, queryParamsMiddleware([`errorMessages`, `user`]), getRegisterPage);
registerRoute.post(`/`, upload(`avatar`), postRegisterPage);

module.exports = registerRoute;
