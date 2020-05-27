'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);

const addRoute = require(`./add`);
const categoryRoute = require(`./category`);
const editRoute = require(`./edit`);

const articlesRoute = new Router();

articlesRoute.use(`/add`, addRoute);
articlesRoute.use(`/category`, categoryRoute);
articlesRoute.use(`/edit`, editRoute);
articlesRoute.get(`/:id`, (req, res) => {
  const content = {
    isPost: true,
    article: {
      image: {
        fileName: `sea-fullsize@1x.jpg`,
        alt: `пейзаж море, скалы, пляж`,
      },
      date: {
        stamp: `2019-03-21T20:33`,
        day: `21.03.2019`,
        time: `20:33`
      },
      title: `AirPods в один клик`,
      subTitle: `Бирюзовое доверие`,
      text: [
        `У Apple иногда попадаются интерфейсы, за которые создателей хочется сильно поругать — к примеру интерфейс публикации приложения в AppStore, для которого я уже неделю восстановливаю свой аккаунт разработчика.`,
        `Или интерфейс подключения AirPods на макбуке. Чтобы переключить наушники между телефоном и компьютером, нужно сначала нажать на значок звука, затем дождаться, когда в списке устройств появятся наушники, потом нажать на них и дождаться, пока случится вся магия подключения. Иногда по загадочным причинам магия не случается, и операцию нужно повторить, выполняя все те же клики-ожидания-клики — бесит.`
      ],
    },
    account: {
      type: `user`,
      name: `Алёна Фролова`,
      avatar: `img/avatar-2.png`,
    },
    scriptList: [`js/main.js`],
    comments: {
      hasUserError: false,
      list: [
        {
          account: {
            type: `user`,
            avatar: `img/avatar-1.png`,
            name: `Евгений Петров`,
          },
          date: {
            stamp: `2019-03-21T20:33`,
            day: `21.03.2019`,
            time: `20:33`
          },
          text: `Автор, ты все выдумал, покайся`,
          articleTitle: `AirPods в один клик`,
        },
        {
          account: {
            type: `user`,
            avatar: `img/avatar-5.png`,
            name: `Александр Марков`,
          },
          date: {
            stamp: `2019-03-21T20:33`,
            day: `21.03.2019`,
            time: `20:33`
          },
          text: `Конечно, прежде чем так писать, нужно искренне приложить усилия, чтобы разобраться — не все люди умеют выражать свои мысли.`,
          articleTitle: `AirPods в один клик`,
        },
        {
          account: {
            type: `user`,
            avatar: `img/avatar-4.png`,
            name: `Евгений Петров`,
          },
          date: {
            stamp: `2019-03-21T20:33`,
            day: `21.03.2019`,
            time: `20:33`
          },
          text: `Автор, ты все выдумал, покайся`,
          articleTitle: `AirPods в один клик`,
        },
        {
          account: {
            type: `user`,
            avatar: `img/avatar-3.png`,
            name: `Александр Марков`,
          },
          date: {
            stamp: `2019-03-21T20:33`,
            day: `21.03.2019`,
            time: `20:33`
          },
          text: `Конечно, прежде чем так писать, нужно искренне приложить усилия, чтобы разобраться — не все люди умеют выражать свои мысли.`,
          articleTitle: `AirPods в один клик`,
        },
      ],
    },
  };
  res.render(`pages/articles/article`, content);
  logger.endRequest(req, res);
});

module.exports = articlesRoute;
