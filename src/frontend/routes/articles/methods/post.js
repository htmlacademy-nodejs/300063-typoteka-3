'use strict';

const {logger} = require(`../../../utils`);
const {commentAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const {articleId} = req.params;
  const {text} = req.body;
  const commentRes = await commentAdapter.addItem({articleId, text});

  let path = `/articles/${articleId}#comments`;
  if (commentRes.content && commentRes.content.errorMessages) {
    const queryParams = {
      comment: {
        text,
      },
      errorMessages: commentRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/articles/${articleId}?params=${query}#new-comment`;
  }
  res.redirect(path);
  logger.endRequest(req, res);
};
