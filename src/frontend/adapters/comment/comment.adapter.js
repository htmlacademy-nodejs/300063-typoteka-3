'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class CommentAdapter {
  async getList() {
    const comments = await request.get(`comments`);
    return comments.map((comment) => ({
      ...comment,
      date: dateAdapter.get(comment.date),
    }));
  }

  async getListByArticleId(articleId) {
    const comments = await request.get(`articles/${articleId}/comments`);
    return comments.map((comment) => ({
      ...comment,
      date: dateAdapter.get(comment.date),
    }));
  }

  addItem(params) {
    const {articleId, text} = params;
    return request.post(`articles/${articleId}/comments`, {text});
  }

  // _adaptComment(comment, index, articleTitle) {
  //   const imageIndex = (index % 5) + 1;
  //   return {
  //     ...comment,
  //     createdDate: dateAdapter.get(comment.date),
  //     account: accountAdapter.getUserById(imageIndex),
  //     articleTitle,
  //   };
  // }
}

module.exports = new CommentAdapter();
