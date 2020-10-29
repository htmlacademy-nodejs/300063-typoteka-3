#!/usr/bin/env node
'use strict';

const path = require(`path`);
require(`dotenv`).config({
  path: path.resolve(process.mainModule.path, `.env`)
});
require(`./src/backend/service.js`);
