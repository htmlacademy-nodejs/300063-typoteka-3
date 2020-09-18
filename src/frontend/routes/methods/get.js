'use strict';

const {logger, getPaginatorParams} = require(`../../utils`);
const {accountAdapter, articleAdapter, commentAdapter} = require(`../../adapters`);
const {
  ONE_PAGE_LIMIT,
  LAST_COMMENT_COUNT,
  LAST_COMMENT_LETTERS,
  HOT_ARTICLE_COUNT,
  HOT_ARTICLE_ANNOUNCE_LETTER,
  FIRST_PAGE,
} = require(`../../../common/params`);


const getArticles = async (page) => {
  return await articleAdapter.getList({
    page,
    limit: ONE_PAGE_LIMIT,
  });
};

const getHotArticles = async () => {
  const articlesRes = await articleAdapter.getList({
    limit: HOT_ARTICLE_COUNT,
    sort: `commentCount`,
  });
  return articlesRes.list.map((hotArticle) => ({
    ...hotArticle,
    announce: hotArticle.announce.length > LAST_COMMENT_LETTERS
      ? `${hotArticle.announce.slice(0, HOT_ARTICLE_ANNOUNCE_LETTER)}...`
      : hotArticle.announce,
  }));
};

const getComments = async () => {
  const commentsRes = await commentAdapter.getList({
    limit: LAST_COMMENT_COUNT,
  });
  return commentsRes.map((comment) => ({
    ...comment,
    text: comment.text.length > LAST_COMMENT_LETTERS
      ? `${comment.text.slice(0, LAST_COMMENT_LETTERS)}...`
      : comment.text,
  }));
};

module.exports = async (req, res) => {
  const page = +req.query.page || FIRST_PAGE;
  const articles = await getArticles(page);
  const hotArticles = await getHotArticles();
  const comments = await getComments();
  const paginator = getPaginatorParams(page, articles.length);
  const content = {
    title: `Типотека`,
    hiddenTitle: ` Главная страница личного блога Типотека`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: accountAdapter.getAuth(),
    articleList: articles.list,
    hasContent: true,
    hotArticles,
    comments,
    paginator,
  };
  res.render(`pages/main`, content);
  logger.endRequest(req, res);
};
