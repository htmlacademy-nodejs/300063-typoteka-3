'use strict';

const fs = require(`fs`);

const {logger} = require(`service/utils`);
const {FILE_CATEGORIES_PATH} = require(`service/constants`);


const log = logger.getLogger();

class CategoryAdapter {
  constructor() {
    try {
      this._list = JSON.parse(fs.readFileSync(FILE_CATEGORIES_PATH, `utf8`));
      log.debug(`Category adapter init`);
    } catch (error) {
      log.error(`Can't read file ${FILE_CATEGORIES_PATH} ${error}`);
    }
  }

  getList() {
    return this._list.slice();
  }
}

module.exports = new CategoryAdapter();
