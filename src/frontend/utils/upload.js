'use strict';

const path = require(`path`);
const multer = require(`multer`);
const {params} = require(`common`);


const tempDir = process.env.DEFAULT_TEMP_DIR || params.DEFAULT_TEMP_DIR;
const upload = (fieldName) => {

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.resolve(__dirname, `./${tempDir}/`));
    },
    filename(req, file, cb) {
      cb(null, `${+Date.now()}-${file.originalname}`);
    },
  });
  const temp = multer({storage});
  return temp.single(fieldName);
};

module.exports = upload;
