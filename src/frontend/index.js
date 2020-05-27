'use strict';

const path = require(`path`);

const express = require(`express`);

const mainRoute = require(`./routes`);
const params = require(`./params`);

const app = express();
app.set(`views`, path.resolve(__dirname, params.DIR_WITH_VIEW));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, params.PUBLIC_DIR)));
app.use(`/`, mainRoute);

app.listen(params.DEFAULT_PORT);
