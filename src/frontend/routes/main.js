'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);

const articlesRoute = require(`./articles`);
const categoriesRoute = require(`./categories`);
const loginRoute = require(`./login`);
const myRoute = require(`./my`);
const registerRoute = require(`./register`);
const searchRoute = require(`./search`);


const mainRoute = new Router();

mainRoute.use(`/articles`, articlesRoute);
mainRoute.use(`/categories`, categoriesRoute);
mainRoute.use(`/login`, loginRoute);
mainRoute.use(`/my`, myRoute);
mainRoute.use(`/register`, registerRoute);
mainRoute.use(`/search`, searchRoute);
mainRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    hiddenTitle: ` Главная страница личного блога Типотека`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    // account: {
    //   type: `admin`,
    //   name: `Алёна Фролова`,
    //   avatar: `img/avatar-2.png`,
    // },
    account: null,
    hasContent: true,
    hasHot: true,
    hasLastComments: true,
  };
  res.render(`pages/main`, content);
  logger.endRequest(req, res);
});

module.exports = mainRoute;
