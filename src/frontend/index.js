'use strict';

const path = require(`path`);

const express = require(`express`);
const {logger} = require(`frontend/utils`);
// const {debugMiddleware} = require(`frontend/middleware`);

const mainRoute = require(`./routes`);
const {params} = require(`common`);

const app = express();
// app.use(logger.expressPinoLogger);
app.use(express.json());
// app.use(debugMiddleware);

app.set(`views`, path.resolve(__dirname, process.env.DIR_WITH_VIEW || params.DEFAULT_DIR_WITH_VIEW));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, process.env.PUBLIC_DIR || params.DEFAULT_PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));
app.use(`/`, mainRoute);

const port = parseInt(process.env.FRONTEND_PORT, 10) || params.DEFAULT_FRONTEND_PORT;
app.listen(port, () => logger.startServer(port))
  .on(`error`, (error) => logger.errorStart(error));
