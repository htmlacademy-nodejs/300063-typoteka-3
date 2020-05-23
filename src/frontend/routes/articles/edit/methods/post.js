'use strict';

const {articleAdapter, FileAdapter} = require(`frontend/adapters`);
const {logger} = require(`frontend/utils`);
const getEditArticlePage = require(`./get`);


const setFileName = async (req, res) => {
  if (!req.file) {
    const currentArticleResponse = await articleAdapter.getItemById(req.params.id);
    req.body.image = req.body.image || currentArticleResponse.image;
    return;
  }
  const fileResponse = await FileAdapter.download(req.file);
  if (fileResponse.error) {
    logger.endRequest(req, fileResponse);
    await getEditArticlePage(req, res);
  } else {
    req.body.image = fileResponse;
  }
};

const updateArticleItemAndRedirect = async (req, res) => {
  const articleResponse = await articleAdapter.updateItemById(req.params.id, req.body);
  if (articleResponse.error) {
    logger.endRequest(req, articleResponse);
    await getEditArticlePage(req, res);
  } else {
    res.redirect(`/articles/${req.params.id}`);
  }
};


module.exports = async (req, res) => {
  await setFileName(req, res);
  await updateArticleItemAndRedirect(req, res);
  logger.endRequest(req, res);
};
