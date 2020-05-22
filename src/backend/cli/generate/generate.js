'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const dateFormat = require(`date-format`);
const chalk = require(`chalk`);

const {getNumbersDayInMilliseconds, getRandomInt, shuffle} = require(`backend/utils`);
const {params} = require(`common`);


const currentDate = Number(new Date());
const maxPublishedDaysAgoInMilliseconds = getNumbersDayInMilliseconds(params.generate.OLDEST_PUBLICATION_COUNT_DAY);

const getDatePublication = () => {
  const publishedMillisecondsAgo = getRandomInt(0, maxPublishedDaysAgoInMilliseconds);
  const date = new Date(currentDate - publishedMillisecondsAgo);
  return dateFormat(`yyyy-MM-dd hh:mm:ss`, date);
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
    category: shuffle(categories).slice(1, getRandomInt(1, categories.length - 1)),
    comments: generateComments(comments),
  }))
);

const showErrorIfCountIsNotCorrect = (count) => {
  if (count < params.generate.Count.MIN) {
    console.error(chalk.red(`Generating count can't be less then '${params.generate.Count.MIN}'`));
    process.exit(params.ExitCodes.ERROR);
  }
  if (count > params.generate.Count.MAX) {
    console.error(chalk.red(`Generating count can't be more then '${params.generate.Count.MAX}'`));
    process.exit(params.ExitCodes.ERROR);
  }
};

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(`Can't read file ${filePath}`));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  alias: `-g`,
  async run(argv) {
    const count = Number(argv) || params.generate.Count.DEFAULT;
    showErrorIfCountIsNotCorrect(count);
    const TITLES = await readFile(params.DEFAULT_FILE_TITLES_PATH);
    const TEXTS = await readFile(params.DEFAULT_FILE_TEXTS_PATH);
    const CATEGORIES = await readFile(params.DEFAULT_FILE_CATEGORIES_PATH);
    const COMMENTS = await readFile(params.DEFAULT_FILE_COMMENTS_PATH);
    const content = JSON.stringify(generateArticles(count, TITLES, TEXTS, CATEGORIES, COMMENTS));
    try {
      await fs.writeFile(params.DEFAULT_MOCK_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
