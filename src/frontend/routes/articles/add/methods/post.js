'use strict';

const {articleAdapter, FileAdapter} = require(`../../../../adapters`);
const {logger, transformDate} = require(`../../../../utils`);


const setFileName = async (req) => {
  if (!req.file) {
    return;
  }
  req.body.image = await FileAdapter.download(req.file);
};

const addArticleItemAndRedirectToMyArticles = async (req, res) => {
  const {date, title, announce, categories, text, image} = req.body;
  const articleParams = {
    title,
    announce,
    text,
    categories: categories ? categories.map((category) => +category) : [],
    image,
    date: transformDate(date),
  };
  const articleRes = await articleAdapter.addItem(articleParams);
  let path = `/my`;
  if (articleRes.content && articleRes.content.errorMessages) {
    const queryParams = {
      article: {
        ...articleParams,
        date,
      },
      errorMessages: articleRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/articles/add?params=${query}`;
  }
  res.redirect(path);
  logger.endRequest(req, res);
};

module.exports = async (req, res) => {
  await setFileName(req, res);
  await addArticleItemAndRedirectToMyArticles(req, res);
  logger.endRequest(req, res);
};
