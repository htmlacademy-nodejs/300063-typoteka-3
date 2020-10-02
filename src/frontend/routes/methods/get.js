'use strict';

const {logger} = require(`../../utils`);
const {accountAdapter, articleAdapter} = require(`../../adapters`);
const {ONE_PAGE_LIMIT, MAX_DISPLAYED_PAGES} = require(`../../../common/params`);


const FIRST_PAGE = 1;
const PAGE_DIFFERENTIAL = Math.floor(MAX_DISPLAYED_PAGES / 2);
const DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE = MAX_DISPLAYED_PAGES - 1;

const getPaginator = (page, lastPage) => {
  if (lastPage <= MAX_DISPLAYED_PAGES) {
    return {
      start: FIRST_PAGE,
      end: lastPage,
      page,
    };
  }
  let start = page - PAGE_DIFFERENTIAL;
  if (start < FIRST_PAGE) {
    start = FIRST_PAGE;
  }
  let end = start + DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE;
  if (lastPage < end) {
    end = lastPage;
    start = end - DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE;
  }
  return {
    start,
    end,
    page,
  };
};

module.exports = async (req, res) => {
  const page = +req.query.page || FIRST_PAGE;
  const articles = await articleAdapter.getPartList(page);
  const content = {
    title: `Типотека`,
    hiddenTitle: ` Главная страница личного блога Типотека`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: accountAdapter.getAuth(),
    articleList: articles.list,
    hasContent: true,
    hasHot: true,
    hasLastComments: true,
    paginator: getPaginator(page, Math.ceil(articles.length / ONE_PAGE_LIMIT)),
  };
  res.render(`pages/main`, content);
  logger.endRequest(req, res);
};
