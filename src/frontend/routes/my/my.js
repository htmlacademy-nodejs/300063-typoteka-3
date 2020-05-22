'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);
const {dateAdapter} = require(`frontend/adapters`);

const commentsRoute = require(`./comments`);


const myRoute = new Router();

myRoute.use(`/comments`, commentsRoute);
myRoute.get(`/`, (req, res) => {
  const content = {
    articleList: [
      {
        id: 1,
        date: dateAdapter.get(`2019-03-21T20:33`),
        title: `AirPods в один клик`,
      },
      {
        id: 2,
        date: dateAdapter.get(`2019-03-21T20:33`),
        title: `AirPods в один клик`,
      },
      {
        id: 3,
        date: dateAdapter.get(`2019-03-21T20:33`),
        title: `AirPods в один клик`,
      },
    ],
  };
  res.render(`pages/my/my`, content);
  logger.endRequest(req, res);
});

module.exports = myRoute;
