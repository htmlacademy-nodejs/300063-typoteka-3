'use strict';

const fs = require(`fs`);
const dateFormat = require(`date-format`);
const chalk = require(`chalk`);

const {getNumbersDayInMilliseconds, getRandomInt, shuffle} = require(`../../utils`);
const {
  fileName: FILE_NAME,
  titles: TITLES,
  texts: TEXTS,
  oldestPublicationCountDay: OLDEST_PUBLICATION_COUNT_DAY,
  categories: CATEGORIES,
  count: Count,
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
  if (count < 1) {
    console.error(chalk.red(`Generating count can't be less then '${Count.min}'`));
    process.exit(ExitCode.ERROR);
  }
  if (count > 1000) {
    console.error(chalk.red(`Generating count can't be more then '${Count.max}'`));
    process.exit(ExitCode.ERROR);
  }
};

module.exports = {
  name: `--generate`,
  run(argv) {
    const count = Number(argv);
    showErrorIfCountIsNotCorrect(count);
    const content = JSON.stringify(generateArticles(count));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.info(chalk.red(`Can't write data to file...`));
        process.exit(ExitCode.ERROR);
      }
      return console.info(chalk.green(`Operation success. File created.`));
    });
  }
};
