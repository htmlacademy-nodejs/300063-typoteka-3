'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class ArticleAdapter {
  async getList() {
    return await request.get(`articles`)
      .then((articleList) => articleList.map(this._adaptArticle));
  }

  _adaptArticle(article) {
    article.createdDate = dateAdapter.get(article.createdDate);
    return article;
  }
}

module.exports = new ArticleAdapter();
