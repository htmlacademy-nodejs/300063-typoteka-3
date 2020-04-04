'use strict';

const fs = require(`fs`).promises;
const dateFormat = require(`date-format`);
const chalk = require(`chalk`);

const {getNumbersDayInMilliseconds, getRandomInt, shuffle} = require(`../../utils`);
const {
  FILE_NAME,
  TITLES,
  TEXTS,
  OLDEST_PUBLICATION_COUNT_DAY,
  CATEGORIES,
  Count,
} = require(`./mock-params`);
const {ExitCode} = require(`../../constants`);


const currentDate = Number(new Date());
const maxPublishedDaysAgoInMilliseconds = getNumbersDayInMilliseconds(OLDEST_PUBLICATION_COUNT_DAY);

const getDatePublication = () => {
  const publishedMillisecondsAgo = getRandomInt(0, maxPublishedDaysAgoInMilliseconds);
  const date = new Date(currentDate - publishedMillisecondsAgo);
  return dateFormat(`yyyy-MM-dd hh:mm:ss`, date);
};

const generateArticles = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    announce: TEXTS[getRandomInt(0, TEXTS.length - 1)],
    fullText: shuffle(TEXTS).slice(1, getRandomInt(1, TEXTS.length - 1)).join(` `),
    createdDate: getDatePublication(),
    category: shuffle(CATEGORIES).slice(1, getRandomInt(1, CATEGORIES.length - 1)),
  }))
);

const showErrorIfCountIsNotCorrect = (count) => {
  if (count < Count.MIN) {
    console.error(chalk.red(`Generating count can't be less then '${Count.MIN}'`));
    process.exit(ExitCode.ERROR);
  }
  if (count > Count.MAX) {
    console.error(chalk.red(`Generating count can't be more then '${Count.MAX}'`));
    process.exit(ExitCode.ERROR);
  }
};

module.exports = {
  name: `--generate`,
  alias: `-g`,
  async run(argv) {
    const count = Number(argv) || Count.DEFAULT;
    showErrorIfCountIsNotCorrect(count);
    const content = JSON.stringify(generateArticles(count));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
