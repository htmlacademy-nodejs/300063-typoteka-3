'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);
const {accountAdapter} = require(`../account`);

class CommentAdapter {
  async getList() {
    const articleList = await request.get(`articles`);
    return articleList.slice(0, 3)
      .reduce((commentList, article) => {
        const list = article.comments.map((comment, index) => this._adaptComment(comment, index, article.title));
        return [
          ...commentList,
          ...list,
        ];
      }, []);
  }

  _adaptComment(comment, index, articleTitle) {
    const imageIndex = (index % 5) + 1;
    return {
      ...comment,
      createdDate: dateAdapter.get(new Date()),
      account: accountAdapter.getUserById(imageIndex),
      articleTitle,
    };
  }
}

module.exports = new CommentAdapter();
