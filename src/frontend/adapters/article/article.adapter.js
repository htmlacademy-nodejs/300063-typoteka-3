'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class ArticleAdapter {
  async getList() {
    const articleList = await request.get(`articles`);
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
