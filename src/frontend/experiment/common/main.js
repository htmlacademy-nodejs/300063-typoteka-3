'use strict';

const {logger, getPaginatorParams} = require(`../../utils`);
const {articleAdapter, categoryAdapter, commentAdapter} = require(`../../adapters`);
const {
  ONE_PAGE_LIMIT,
  LAST_COMMENT_COUNT,
  LAST_COMMENT_LETTERS,
  HOT_ARTICLE_COUNT,
  HOT_ARTICLE_ANNOUNCE_LETTER,
  FIRST_PAGE,
} = require(`../../../common/params`);


class MainRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const page = +req.query.page || FIRST_PAGE;
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
        limit: ONE_PAGE_LIMIT,
      },
    });
  }

  async _getHotArticles() {
    const articlesRes = await articleAdapter.getList({
      query: {
        limit: HOT_ARTICLE_COUNT,
        sort: `commentCount`,
        minCommentCount: 1,
      },
    });
    articlesRes.list = articlesRes.list.map((hotArticle) => ({
      ...hotArticle,
      announce: hotArticle.announce.length > LAST_COMMENT_LETTERS
        ? `${hotArticle.announce.slice(0, HOT_ARTICLE_ANNOUNCE_LETTER)}...`
        : hotArticle.announce,
    }));
    return articlesRes;
  }

  async _getComments() {
    const commentsRes = await commentAdapter.getList({
      query: {
        limit: LAST_COMMENT_COUNT,
      },
    });
    return commentsRes.map((comment) => ({
      ...comment,
      text: comment.text.length > LAST_COMMENT_LETTERS
        ? `${comment.text.slice(0, LAST_COMMENT_LETTERS)}...`
        : comment.text,
    }));
  }
}

module.exports = MainRoute;
