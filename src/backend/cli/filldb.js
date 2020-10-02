'use strict';

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  FILE_CATEGORIES_PATH,
  FILE_FIRSTNAMES_PATH,
  FILE_LASTNAMES_PATH,
  FILE_EMAILS_PATH,
  FILE_AVATARS_PATH,
  FILE_IMAGES_PATH,
  FILE_COMMENTS_PATH,
  FILE_TITLES_PATH,
  FILE_TEXTS_PATH,
  generate,
  ExitCode,
} = require(`../../common/params`);
const {db, sequelize} = require(`../db`);
const {getRandomInt, readFile, shuffle} = require(`../utils`);


const showAccessError = (error, tableName) => {
  console.error(chalk.red(`Operation failed. Access to the "${tableName}" table`));
  process.exit(ExitCode.ERROR);
};

const fillCategoryTable = async (categories) => {
  const categoriesForDbTable = categories.map((category) => ({title: category}));
  await db.Category.bulkCreate(categoriesForDbTable)
    .catch((error) => showAccessError(error, `categories`));
};

const fillAccountTable = async (firstnames, lastnames, emails, avatars, count) => {
  const accountsForDbTable = Array(count).fill({}).map((item, index) => ({
    firstname: firstnames[getRandomInt(0, firstnames.length - 1)],
    lastname: lastnames[getRandomInt(0, lastnames.length - 1)],
    email: emails[getRandomInt(0, emails.length - 1)],
    avatar: avatars[getRandomInt(0, avatars.length - 1)],
    password: nanoid(),
    isAdmin: index === 0,
  }));
  await db.Account.bulkCreate(accountsForDbTable)
    .catch((error) => showAccessError(error, `accounts`));
};

const fillArticlesTable = async (titles, texts, images, count) => {
  const articlesForDbTable = Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: texts[getRandomInt(0, texts.length - 1)],
    text: shuffle(texts).slice(1, getRandomInt(1, texts.length - 1)).join(` `),
    image: images[getRandomInt(0, images.length - 1)],
    date: new Date(),
  }));
  await db.Article.bulkCreate(articlesForDbTable)
    .catch((error) => showAccessError(error, `articles`));
};

const fillCommentTable = async (comments, count) => {
  const commentsForDbTable = Array(count).fill({}).map(() => ({
    text: shuffle(comments).slice(1, getRandomInt(1, comments.length - 1)).join(` `),
    date: new Date(),
    accountId: getRandomInt(1, count),
    articleId: getRandomInt(1, count),
  }));
  await db.Comment.bulkCreate(commentsForDbTable)
    .catch((error) => showAccessError(error, `comments`));
};

const fillArticleCategoryTable = async () => {
  const articles = await db.Article.findAll({raw: true});
  const categories = await db.Category.findAll({raw: true});
  const sqlValues = articles.reduce((acc, article) => {
    const records = shuffle(categories.slice())
      .slice(0, getRandomInt(1, 3))
      .map((category) => `(${article.id}, ${category.id})`);
    return acc.concat(records);
  }, []);
  const articleCategorySql = `INSERT INTO public."articleCategory" VALUES ${sqlValues.join(`,`)};`;
  await sequelize.query(articleCategorySql, {
    type: sequelize.QueryTypes.INSERT
  })
    .catch((error) => showAccessError(error, `articleCategory`));
};

module.exports = {
  name: `--filldb`,
  alias: `-fdb`,
  async run(argv) {
    const count = Number(argv) || generate.Count.DEFAULT;

    const CATEGORIES = await readFile(FILE_CATEGORIES_PATH);
    const FIRSTNAMES = await readFile(FILE_FIRSTNAMES_PATH);
    const LASTNAMES = await readFile(FILE_LASTNAMES_PATH);
    const EMAILS = await readFile(FILE_EMAILS_PATH);
    const AVATARS = await readFile(FILE_AVATARS_PATH);
    const TITLES = await readFile(FILE_TITLES_PATH);
    const TEXTS = await readFile(FILE_TEXTS_PATH);
    const IMAGES = await readFile(FILE_IMAGES_PATH);
    const COMMENTS = await readFile(FILE_COMMENTS_PATH);

    await fillCategoryTable(CATEGORIES);
    await fillAccountTable(FIRSTNAMES, LASTNAMES, EMAILS, AVATARS, count);
    await fillArticlesTable(TITLES, TEXTS, IMAGES, count);
    await fillCommentTable(COMMENTS, count);
    await fillArticleCategoryTable();

    console.info(chalk.green(`Operation success. Mock data added to DB tables`));
    process.exit(ExitCode.SUCCESS);
  }
};
