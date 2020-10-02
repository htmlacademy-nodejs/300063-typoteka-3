'use strict';

const fs = require(`fs`).promises;

const {nanoid} = require(`nanoid`);
const dateFormat = require(`dateformat`);
const chalk = require(`chalk`);

const {getNumbersDayInMilliseconds, getRandomInt, readFile, shuffle} = require(`../utils`);
const {backendParams, ExitCode} = require(`../../common/params`);


const currentDate = Number(new Date());
const maxPublishedDaysAgoInMilliseconds = getNumbersDayInMilliseconds(backendParams.generate.OLDEST_PUBLICATION_COUNT_DAY);


const getDatePublication = () => {
  const publishedMillisecondsAgo = getRandomInt(0, maxPublishedDaysAgoInMilliseconds);
  const date = new Date(currentDate - publishedMillisecondsAgo);
  return dateFormat(date, `yyyy-mm-dd hh:MM:ss`);
};

const generateComments = (comments) => shuffle(comments).slice(1, getRandomInt(1, comments.length - 1)).map((comment) => ({
  id: nanoid(),
  text: comment,
}));

const generateArticles = (count, titles, texts, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: texts[getRandomInt(0, texts.length - 1)],
    fullText: shuffle(texts).slice(1, getRandomInt(1, texts.length - 1)).join(` `),
    createdDate: getDatePublication(),
    categories: shuffle(categories).slice(1, getRandomInt(1, categories.length - 1)),
    comments: generateComments(comments),
  }))
);

const showErrorIfCountIsNotCorrect = (count) => {
  if (count < backendParams.generate.Count.MIN) {
    console.error(chalk.red(`Generating count can't be less then '${backendParams.generate.Count.MIN}'`));
    process.exit(ExitCode.ERROR);
  }
  if (count > backendParams.generate.Count.MAX) {
    console.error(chalk.red(`Generating count can't be more then '${backendParams.generate.Count.MAX}'`));
    process.exit(ExitCode.ERROR);
  }
};

module.exports = {
  name: `--generate`,
  alias: `-g`,
  async run(argv) {
    const count = Number(argv) || backendParams.generate.Count.DEFAULT;
    showErrorIfCountIsNotCorrect(count);
    const TITLES = await readFile(backendParams.FILE_TITLES_PATH);
    const TEXTS = await readFile(backendParams.FILE_TEXTS_PATH);
    const CATEGORIES = await readFile(backendParams.FILE_CATEGORIES_PATH);
    const COMMENTS = await readFile(backendParams.FILE_COMMENTS_PATH);
    const content = JSON.stringify(generateArticles(count, TITLES, TEXTS, CATEGORIES, COMMENTS));
    try {
      await fs.writeFile(backendParams.MOCK_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
