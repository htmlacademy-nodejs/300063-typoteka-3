'use strict';

const express = require(`express`);

const mainRoute = require(`./routes`);
const params = require(`./params`);

const app = express();
app.use(`/`, mainRoute);

app.listen(params.DEFAULT_PORT);
