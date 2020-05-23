'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;

const {params} = require(`common`);


class FileAdapter {
  constructor() {
    this._allowTypes = [`image/jpeg`, `image/png`];
  }

  async download(file) {
    if (!file) {
      return this._getError(`file`, `File doesn't have`);
    }
    const {mimetype, path: filePath, destination, filename, size} = file;

    if (size === 0 || !this._allowTypes.includes(mimetype)) {
      fs.unlink(filePath);
      return this._getError(`size`, `File can't be empty`);
    }
    try {
      const publicDir = process.env.PUBLIC_DIR || params.DEFAULT_PUBLIC_DIR;
      const newFilePath = path.resolve(destination, `../${publicDir}/img/${filename}`);
      await fs.rename(filePath, newFilePath);
      return filename;
    } catch (error) {
      fs.unlink(filePath);
      return this._getError(`server`, `Internal server error`, error);
    }
  }

  _getError(type, message, content = null) {
    return {
      error: {
        type,
        message,
        content,
      },
    };
  }
}

module.exports = new FileAdapter();
