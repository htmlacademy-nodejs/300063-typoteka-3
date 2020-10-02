'use strict';

const path = require(`path`);

const express = require(`express`);

const {DEFAULT_VIEW_DIR, DEFAULT_PUBLIC_DIR, DEFAULT_FRONTEND_PORT} = require(`../common/params`);
const {logger} = require(`./utils`);
const {debugMiddleware} = require(`./middleware`);

const mainRoute = require(`./routes`);

const app = express();
app.use(logger.expressPinoLogger);
app.use(express.json());
app.use(debugMiddleware);

app.set(`views`, path.resolve(__dirname, process.env.VIEW_DIR || DEFAULT_VIEW_DIR));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, process.env.PUBLIC_DIR || DEFAULT_PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));
app.use(`/`, mainRoute);

const port = parseInt(process.env.FRONTEND_PORT, 10) || DEFAULT_FRONTEND_PORT;
app.listen(port, () => logger.startServer(port))
  .on(`error`, (error) => logger.errorStart(error));
