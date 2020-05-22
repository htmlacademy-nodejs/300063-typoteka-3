'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);
const {accountAdapter, dateAdapter} = require(`frontend/adapters`);


const commentsRoute = new Router();

commentsRoute.get(`/`, (req, res) => {
  const content = {
    commentList: [
      {
        account: accountAdapter.getUserById(1),
        date: dateAdapter.get(`2019-03-21 20:33`),
        text: `Автор, ты все выдумал, покайся`,
        articleTitle: `AirPods в один клик`,
      },
      {
        account: accountAdapter.getUserById(5),
        date: dateAdapter.get(`2019-03-21 20:33`),
        text: `Конечно, прежде чем так писать, нужно искренне приложить усилия, чтобы разобраться — не все люди умеют выражать свои мысли.`,
        articleTitle: `AirPods в один клик`,
      },
      {
        account: accountAdapter.getUserById(4),
        date: dateAdapter.get(`2019-03-21 20:33`),
        text: `Автор, ты все выдумал, покайся`,
        articleTitle: `AirPods в один клик`,
      },
      {
        account: accountAdapter.getUserById(3),
        date: dateAdapter.get(`2019-03-21 20:33`),
        text: `Конечно, прежде чем так писать, нужно искренне приложить усилия, чтобы разобраться — не все люди умеют выражать свои мысли.`,
        articleTitle: `AirPods в один клик`,
      },
    ],
  };
  res.render(`pages/my/comments`, content);
  logger.endRequest(req, res);
});

module.exports = commentsRoute;
