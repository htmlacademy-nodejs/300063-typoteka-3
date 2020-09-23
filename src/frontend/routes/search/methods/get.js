'use strict';

const {logger} = require(`../../../utils`);
const {accountAdapter, articleAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const search = req.query.title ? req.query.title.trim() : ``;
  const articleRes = await articleAdapter.getList({
    query: {
      title: encodeURIComponent(search),
      isSearch: true,
    },
  });

  const content = {
    title: `Типотека`,
    hiddenTitle: ` Страница поиска личного блога Типотека`,
    account: accountAdapter.getAuth(),
    search,
    articles: articleRes.list,
    scriptList: [`js/main.js`],
  };
  res.render(`pages/search`, content);
  logger.endRequest(req, res);
};

