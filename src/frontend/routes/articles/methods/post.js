'use strict';

const {logger} = require(`../../../utils`);
const {commentAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const {articleId} = req.params;
  const {text} = req.body;
  console.log(text);
  const commentRes = await commentAdapter.addItem({articleId, text});

  let path = `/articles/${articleId}`;
  if (commentRes.content && commentRes.content.errorMessages) {
    const queryParams = {
      comment: {
        text,
      },
      errorMessages: commentRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/articles/${articleId}?params=${query}`;
  }
  res.redirect(path);
  logger.endRequest(req, res);
};
