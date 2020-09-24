'use strict';

const {logger} = require(`../../../utils`);
const {commentAdapter, articleAdapter} = require(`../../../adapters`);


module.exports = async (req, res) => {
  const {articleId} = req.params;
  const {text, action} = req.body;
  const {account} = req.locals;

  if (action === `delete`) {
    await articleAdapter.deleteItem(articleId);
    res.redirect(`/my`);
    return;
  }

  const commentRes = await commentAdapter.addItem({
    text,
    articleId,
    accountId: account.id,
  });

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
