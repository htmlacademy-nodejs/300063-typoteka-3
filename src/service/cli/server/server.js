'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const chalk = require(`chalk`);
const params = require(`./params`);
const constants = require(`../../constants`);

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();
  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });
  res.end(template);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(params.FILE_NAME, `utf8`);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, constants.HttpCodes.OK, `<ul>${message}</ul>`);
      } catch (error) {
        sendResponse(res, constants.HttpCodes.NOT_FOUND, constants.HttpMessages.NOT_FOUND);
      }
      break;

    default:
      sendResponse(res, constants.HttpCodes.NOT_FOUND, constants.HttpMessages.NOT_FOUND);
      break;
  }
};

module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(argv) {
    const port = Number(argv) || params.DEFAULT_PORT;
    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (error) => {
        if (error) {
          return console.error(chalk.red(`Created server error - ${port} port`));
        }
        return console.info(chalk.green(`Waiting connections to ${port} port`));
      });
  }
};
