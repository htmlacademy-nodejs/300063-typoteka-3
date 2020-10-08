'use strict';

const {frontendParams} = require(`../../../common/params`);
const {articleAdapter, commentAdapter} = require(`../../adapters`);
const {appSocket} = require(`../socket`);
const EntityName = require(`../entity-name`);


const ArticleSocketEvent = {
  ARTICLES: `articles`,
  HOT_ARTICLES: `hot-articles`,
};

class Article {
  constructor() {
    this.update = this.update.bind(this);
  }

  async update(req, res, socket) {
    const article = await this._getArticle(req);
    const commentCount = await this._getArticleCommentCount(req);
    const hotArticles = await this._getHotArticles();
    socket.emit(ArticleSocketEvent.ARTICLES, {
      ...article,
      commentCount,
    });
    socket.emit(ArticleSocketEvent.HOT_ARTICLES, hotArticles.list);
  }

  async _getArticle(req) {
    const {articleId} = req.params;
    return await articleAdapter.getItemById(articleId, {
      headers: {
        cookie: req.headers.cookie,
      },
    });
  }

  async _getArticleCommentCount(req) {
    const {articleId} = req.params;
    const comments = await commentAdapter.getList({
      query: {articleId},
    });
    return comments.length;
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
}

module.exports = () => {
  appSocket.add(EntityName.ARTICLES, Article);
};
