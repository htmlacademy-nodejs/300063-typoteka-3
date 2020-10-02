'use strict';

const {logger} = require(`../../../../utils`);
const {commentAdapter} = require(`../../../../adapters`);


module.exports = async (req, res) => {
  const {commentId} = req.params;
  const {action} = req.body;

  if (action === `delete`) {
    await commentAdapter.deleteItem(commentId);
  }
  res.redirect(`/my/comments`);
  logger.endRequest(req, res);
};
