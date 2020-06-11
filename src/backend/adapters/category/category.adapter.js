'use strict';

const fs = require(`fs`);

const {logger} = require(`backend/utils`);
const {params} = require(`common`);


const log = logger.getLogger();

class CategoryAdapter {
  constructor() {
    this._list = [];
    try {
      const content = fs.readFileSync(params.DEFAULT_FILE_CATEGORIES_PATH, `utf8`);
      this._list = content.trim().split(`\n`);
      log.debug(`Category adapter init`);
    } catch (error) {
      log.error(`Can't read file ${params.DEFAULT_FILE_CATEGORIES_PATH} ${error}`);
    }
  }

  getList() {
    return this._list.slice();
  }
}

module.exports = new CategoryAdapter();
