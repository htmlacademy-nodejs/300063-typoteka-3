'use strict';

const {frontendParams} = require(`../../../common/params`);
const {articleAdapter, categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger, getPaginatorParams} = require(`../../utils`);


class ArticlesByCategoryRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const page = +req.query.page || frontendParams.FIRST_PAGE;
    const {categoryId} = req.params || null;

    const categories = await this._getCategories(req);
    const articles = await this._getArticles({
      query: {
        page,
        category: categoryId,
        limit: frontendParams.ONE_PAGE_LIMIT,
      },
      headers: {
        cookie: req.headers.cookie,
      },
    });
    const paginator = getPaginatorParams({
      page,
      itemCount: articles.length,
      path: `articles/category/${categoryId}`,
    });
    const activeCategory = categories.find((category) => category.id === +categoryId);
    if (activeCategory) {
      const content = {
        title: `Типотека | ${activeCategory && activeCategory.title}`,
        activeCategory,
        account,
        categories,
        articles: articles.list,
        paginator,
      };
      res.render(`pages/main`, content);
    } else {
      res.redirect(`/${routeName.NOT_FOUND}`);
    }

    logger.endRequest(req, res);
  }

  async _getArticles(params) {
    return await articleAdapter.getList(params);
  }

  async _getCategories(req) {
    return await categoryAdapter.getList({
      query: {
        minArticleCount: 1,
      },
      headers: {
        cookie: req.headers.cookie,
      },
    });
  }
}

module.exports = ArticlesByCategoryRoute;
