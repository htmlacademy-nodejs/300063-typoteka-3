'use strict';

const {logger, getPaginatorParams} = require(`../../utils`);
const {articleAdapter, categoryAdapter, commentAdapter} = require(`../../adapters`);
const {frontendParams} = require(`../../../common/params`);


class MainRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const page = +req.query.page || frontendParams.FIRST_PAGE;
    const category = req.query.category || null;

    const categories = await this._getCategories();
    const articles = await this._getArticles({
      page,
      category,
    });
    const hotArticles = await this._getHotArticles();
    const comments = await this._getComments();
    const paginator = getPaginatorParams({
      page,
      itemCount: articles.length,
    });
    const content = {
      title: `Типотека`,
      hiddenTitle: ` Главная страница личного блога Типотека`,
      description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
      account,
      categories,
      articles: articles.list,
      hotArticles: hotArticles.list,
      comments,
      paginator,
    };
    res.render(`pages/main`, content);
    logger.endRequest(req, res);
  }


  async _getCategories() {
    return await categoryAdapter.getList({
      query: {
        minArticleCount: 1,
      },
    });
  }

  async _getArticles(queryParams) {
    return await articleAdapter.getList({
      query: {
        ...queryParams,
        limit: frontendParams.ONE_PAGE_LIMIT,
      },
    });
  }

  async _getHotArticles() {
    const articlesRes = await articleAdapter.getList({
      query: {
        limit: frontendParams.HOT_ARTICLE_COUNT,
        sort: `commentCount`,
        minCommentCount: 1,
      },
    });
    articlesRes.list = articlesRes.list.map((hotArticle) => ({
      ...hotArticle,
      announce: hotArticle.announce.length > frontendParams.LAST_COMMENT_LETTERS
        ? `${hotArticle.announce.slice(0, frontendParams.HOT_ARTICLE_ANNOUNCE_LETTER)}...`
        : hotArticle.announce,
    }));
    return articlesRes;
  }

  async _getComments() {
    const commentsRes = await commentAdapter.getList({
      query: {
        limit: frontendParams.LAST_COMMENT_COUNT,
      },
    });
    return commentsRes.map((comment) => ({
      ...comment,
      text: comment.text.length > frontendParams.LAST_COMMENT_LETTERS
        ? `${comment.text.slice(0, frontendParams.LAST_COMMENT_LETTERS)}...`
        : comment.text,
    }));
  }
}

module.exports = MainRoute;
