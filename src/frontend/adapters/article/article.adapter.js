'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class ArticleAdapter {
  async getList(queryParams) {
    let path = `articles`;
    const articles = await request.get(path, queryParams);
    articles.list = articles.list.map(this._adaptArticle);
    return articles;
  }

  addItem(params) {
    return request.post(`articles`, params);
  }

  async getItemById(articleId) {
    const article = await request.get(`articles/${articleId}`);
    return this._adaptArticle(article);
  }

  async updateItemById(articleId, params) {
    return await request.put(`articles/${articleId}`, params);
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
      date: dateAdapter.get(article.date),
    };
  }
}

module.exports = new ArticleAdapter();
