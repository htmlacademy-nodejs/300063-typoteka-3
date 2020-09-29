'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;

const {frontendParams} = require(`../../common/params`);


const imageTypes = [`image/jpeg`, `image/png`];

const download = async (file) => {
  if (!file) {
    return getError(`file`, `File doesn't have`);
  }
  const {mimetype, path: filePath, destination, filename, size} = file;

  if (size === 0 || !imageTypes.includes(mimetype)) {
    fs.unlink(filePath);
    return getError(`size`, `File can't be empty`);
  }
  try {
    const publicDir = process.env.PUBLIC_DIR || frontendParams.DEFAULT_PUBLIC_DIR;
    const newFilePath = path.resolve(destination, `../${publicDir}/img/${filename}`);
    await fs.rename(filePath, newFilePath);
    return filename;
  } catch (error) {
    fs.unlink(filePath);
    return getError(`server`, `Internal server error`, error);
  }
};

const getError = (type, message, content = null) => {
  return {
    error: {
      type,
      message,
      content,
    },
  };
};

module.exports = (fieldName) => async (req, res, next) => {
  if (req.file) {
    req.body[fieldName] = await download(req.file);
  }
  next();
};
