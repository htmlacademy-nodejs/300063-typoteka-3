'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class ArticleAdapter {
  async getList() {
    const articleList = await request.get(`articles`);
    return articleList.map(this._adaptArticle);
  }

  async getItemById(articleId) {
    const article = await request.get(`articles/${articleId}`);
    return this._adaptArticle(article);
  }

  updateItemById(articleId, params) {
    return request.put(`articles/${articleId}`, params);
  }

  async searchByTitle(title) {
    let articleList = await request.get(`search?title=${encodeURI(title)}`);
    if (articleList.statusCode >= 400) {
      articleList = [];
    }
    return articleList.map(this._adaptArticle);
  }

  _adaptArticle(article) {
    return {
      ...article,
      createdDate: dateAdapter.get(article.createdDate),
    };
  }
}

module.exports = new ArticleAdapter();
