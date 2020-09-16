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
  const {date, title, announce, text, categories, image} = req.body;
  const articleRes = await articleAdapter.addItem({
    title,
    announce,
    text,
    categories,
    image,
    date: transformDate(date),
  });
  if (articleRes.content && articleRes.content.errorMessages) {
    logger.endRequest(req, articleRes);
    req.locals = {
      article: req.body,
      errorMessages: articleRes.content.errorMessages,
    };
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
