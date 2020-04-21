'use strict';

const fs = require(`fs`).promises;

const express = require(`express`);

const params = require(`./params`);
const constants = require(`../../constants`);

const app = express();
app.use(express.json());
app.get(`/posts`, async (req, res) => {
  try {
    const contentFile = await fs.readFile(params.FILE_NAME);
    const mock = JSON.parse(contentFile);
    res.json(mock);
  } catch (error) {
    res.status(constants.HttpCodes.INTERNAL_SERVER_ERROR);
  }
});
app.use((req, res) => res
  .status(constants.HttpCodes.NOT_FOUND)
  .send(`Not Found`));


module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(argv) {
    const port = Number(argv) || params.DEFAULT_PORT;
    app.listen(port);
  }
};
