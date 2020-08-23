'use strict';

const {logger} = require(`../../../utils`);
const {accountAdapter, articleAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const search = req.query.title ? req.query.title.trim() : ``;
  const articleList = await articleAdapter.searchByTitle(search);

  const content = {
    title: `Типотека`,
    hiddenTitle: ` Страница поиска личного блога Типотека`,
    account: accountAdapter.getAuth(),
    search,
    searchResult: {
      type: articleList.length === 0 ? `empty` : `list`,
      list: articleList,
    },
    scriptList: [`js/main.js`],
  };
  res.render(`pages/search`, content);
  logger.endRequest(req, res);
};
