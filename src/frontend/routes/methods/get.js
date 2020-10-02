'use strict';

const {logger, getPaginatorParams, getQueryString} = require(`../../utils`);
const {accountAdapter, articleAdapter, categoryAdapter, commentAdapter} = require(`../../adapters`);
const {
  ONE_PAGE_LIMIT,
  LAST_COMMENT_COUNT,
  LAST_COMMENT_LETTERS,
  HOT_ARTICLE_COUNT,
  HOT_ARTICLE_ANNOUNCE_LETTER,
  FIRST_PAGE,
} = require(`../../../common/params`);


const getCategories = async () => {
  return await categoryAdapter.getList({
    minArticleCount: 1,
  });
};

const getArticles = async (queryParams) => {
  return await articleAdapter.getList({
    ...queryParams,
    limit: ONE_PAGE_LIMIT,
  });
};

const getHotArticles = async () => {
  const articlesRes = await articleAdapter.getList({
    limit: HOT_ARTICLE_COUNT,
    sort: `commentCount`,
    minCommentCount: 1,
  });
  articlesRes.list = articlesRes.list.map((hotArticle) => ({
    ...hotArticle,
    announce: hotArticle.announce.length > LAST_COMMENT_LETTERS
      ? `${hotArticle.announce.slice(0, HOT_ARTICLE_ANNOUNCE_LETTER)}...`
      : hotArticle.announce,
  }));
  return articlesRes;
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
  const category = req.query.category || null;

  const categories = await getCategories();
  const articles = await getArticles({
    page,
    category,
  });
  const hotArticles = await getHotArticles();
  const comments = await getComments();
  const paginator = getPaginatorParams(page, articles.length);
  const query = getQueryString({
    category,
  });

  const content = {
    title: `Типотека`,
    hiddenTitle: ` Главная страница личного блога Типотека`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: accountAdapter.getAuth(),
    categories,
    articles: articles.list,
    hotArticles: hotArticles.list,
    comments,
    paginator,
    query: query && `&${query}`,
  };
  res.render(`pages/main`, content);
  logger.endRequest(req, res);
};