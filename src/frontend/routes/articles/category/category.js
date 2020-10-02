'use strict';

const {Router} = require(`express`);

const {logger, getPaginatorParams} = require(`../../../utils`);
const {articleAdapter, categoryAdapter} = require(`../../../adapters`);
const {ONE_PAGE_LIMIT, FIRST_PAGE} = require(`../../../../common/params`);


const categoryRoute = new Router();

const getArticles = async (queryParams) => {
  return await articleAdapter.getList({
    query: {
      ...queryParams,
      limit: ONE_PAGE_LIMIT,
    },
  });
};

const getCategories = async () => {
  return await categoryAdapter.getList({
    query: {
      minArticleCount: 1,
    },
  });
};

categoryRoute.get(`/:categoryId`, async (req, res) => {
  const {account} = req.locals;
  const page = +req.query.page || FIRST_PAGE;
  const {categoryId} = req.params || null;

  const categories = await getCategories();
  const articles = await getArticles({
    page,
    category: categoryId,
  });
  const paginator = getPaginatorParams({
    page,
    itemCount: articles.length,
    path: `articles/category/${categoryId}`,
  });
  const activeCategory = categories.find((category) => category.id === +categoryId);
  const content = {
    title: `Типотека | ${activeCategory.title}`,
    activeCategory,
    account,
    categories,
    articles: articles.list,
    paginator,
  };
  res.render(`pages/main`, content);
  logger.endRequest(req, res);
});

module.exports = categoryRoute;
