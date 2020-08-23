'use strict';

const {articleAdapter, FileAdapter} = require(`../../../../adapters`);
const {logger, transformDate} = require(`../../../../utils`);
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
  if (!req.body.categories) {
    req.body.categories = [];
  }
  if (Object.keys(req.body.categories).length !== 0) {
    req.body.categories = Object.keys(req.body.categories);
  }
  const articleParams = {
    ...req.body,
    createdDate: transformDate(req.body.createdDate),
  };
  const articleResponse = await articleAdapter.updateItemById(req.params.id, articleParams);
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
