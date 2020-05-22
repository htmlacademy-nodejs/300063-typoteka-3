'use strict';

const {logger} = require(`frontend/utils`);
const {commentAdapter} = require(`frontend/adapters`);


module.exports = async (req, res) => {
  const commentList = await commentAdapter.getList();
  const content = {
    commentList,
  };
  res.render(`pages/my/comments`, content);
  logger.endRequest(req, res);
};
