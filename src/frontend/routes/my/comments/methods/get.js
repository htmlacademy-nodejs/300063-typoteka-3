'use strict';

const {logger} = require(`../../../../utils`);
const {commentAdapter} = require(`../../../../adapters`);


module.exports = async (req, res) => {
  const {account} = req.locals;
  const commentList = await commentAdapter.getList();
  const content = {
    account,
    commentList,
  };
  res.render(`pages/my/comments`, content);
  logger.endRequest(req, res);
};
