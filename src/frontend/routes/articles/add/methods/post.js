'use strict';

const getAddArticlePage = require(`./get`);
const {articleAdapter, FileAdapter} = require(`frontend/adapters`);
const {logger} = require(`frontend/utils`);


const setFileName = async (req, res) => {
  if (!req.file) {
    return;
  }
  console.log(req.file);
  const fileResponse = await FileAdapter.download(req.file);
  if (fileResponse.error) {
    console.log(fileResponse.error);
    logger.endRequest(req, fileResponse);
    await getAddArticlePage(req, res);
  } else {
    req.body.picture = fileResponse;
  }
};

const addArticleItemAndRedirectToMyArticles = async (req, res) => {
  const offerRes = await articleAdapter.addItem(req.body);
  if (offerRes.error) {
    logger.endRequest(req, offerRes);
    await getAddArticlePage(req, res);
  } else {
    res.redirect(`/my`);
  }
};

module.exports = async (req, res) => {
  console.log(req.body, req.file);
  await setFileName(req, res);
  await addArticleItemAndRedirectToMyArticles(req, res);
  logger.endRequest(req, res);
};