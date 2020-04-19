'use strict';

const {Router} = require(`express`);

const editRoute = new Router();

editRoute.get(`/:id`, (req, res) => {
  const content = {
    type: `edit`,
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
      categoryList: [
        {
          id: `category-1`,
          name: `Автомобили`,
        },
        {
          id: `category-2`,
          name: `Бизнес`,
        },
        {
          id: `category-3`,
          name: `Дизайн`,
        }
      ],
    },
    account: {
      type: `admin`
    },
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
  };
  res.render(`pages/articles/edit`, content);
});

module.exports = editRoute;
