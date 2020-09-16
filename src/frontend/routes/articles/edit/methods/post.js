'use strict';

const {articleAdapter, FileAdapter} = require(`../../../../adapters`);
const {logger, transformDate} = require(`../../../../utils`);
const getEditArticlePage = require(`./get`);


const setFileName = async (req, res) => {
  if (!req.file) {
    const currentArticleResponse = await articleAdapter.getItemById(req.params.articleId);
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
  const {date, title, announce, text, image} = req.body;
  const categories = req.body.categories && req.body.categories.map((category) => +category);
  const {articleId} = req.params;
  const articleRes = await articleAdapter.updateItemById(articleId, {
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
      article: {
        ...req.body,
        id: articleId,
      },
      errorMessages: articleRes.content.errorMessages,
    };
    await getEditArticlePage(req, res);
  } else {
    res.redirect(`/my`);
  }
};


module.exports = async (req, res) => {
  await setFileName(req, res);
  await updateArticleItemAndRedirect(req, res);
  logger.endRequest(req, res);
};
