'use strict';

const {articleAdapter, FileAdapter} = require(`../../../../adapters`);
const {logger, transformDate} = require(`../../../../utils`);
const getAddArticlePage = require(`./get`);


const setFileName = async (req, res) => {
  if (!req.file) {
    return;
  }
  const fileResponse = await FileAdapter.download(req.file);
  if (fileResponse.error) {
    logger.endRequest(req, fileResponse);
    await getAddArticlePage(req, res);
  } else {
    req.body.image = fileResponse;
  }
};

const addArticleItemAndRedirectToMyArticles = async (req, res) => {
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
  const articleRes = await articleAdapter.addItem(articleParams);
  if (articleRes.content && articleRes.content.error) {
    logger.endRequest(req, articleRes);
    await getAddArticlePage(req, res);
  } else {
    res.redirect(`/my`);
  }
};

module.exports = async (req, res) => {
  await setFileName(req, res);
  await addArticleItemAndRedirectToMyArticles(req, res);
  logger.endRequest(req, res);
};
