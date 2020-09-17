'use strict';

const {articleAdapter, FileAdapter} = require(`../../../../adapters`);
const {logger, transformDate} = require(`../../../../utils`);


const setFileName = async (req) => {
  if (!req.file) {
    const currentArticleResponse = await articleAdapter.getItemById(req.params.articleId);
    req.body.image = req.body.image || currentArticleResponse.image;
    return;
  }
  await FileAdapter.download(req.file);
};

const updateArticleItemAndRedirect = async (req, res) => {
  const {date, title, announce, categories, text, image} = req.body;
  const {articleId} = req.params;
  const articleParams = {
    title,
    announce,
    text,
    categories: categories && categories.map((category) => +category),
    image,
    date: transformDate(date),
  };
  const articleRes = await articleAdapter.updateItemById(articleId, articleParams);
  let path = `/my`;
  if (articleRes.content && articleRes.content.errorMessages) {
    const queryParams = {
      article: {
        ...articleParams,
        id: articleId,
        date,
      },
      errorMessages: articleRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/articles/edit/${articleId}?params=${query}`;
  }
  res.redirect(path);
};


module.exports = async (req, res) => {
  await setFileName(req, res);
  await updateArticleItemAndRedirect(req, res);
  logger.endRequest(req, res);
};
