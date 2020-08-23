'use strict';

const {logger} = require(`../../utils`);
const {accountAdapter, articleAdapter} = require(`../../adapters`);


module.exports = async (req, res) => {
  const articleList = await articleAdapter.getList();
  const content = {
    title: `Типотека`,
    hiddenTitle: ` Главная страница личного блога Типотека`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: accountAdapter.getAuth(),
    articleList,
    hasContent: true,
    hasHot: true,
    hasLastComments: true,
  };
  res.render(`pages/main`, content);
  logger.endRequest(req, res);
};
