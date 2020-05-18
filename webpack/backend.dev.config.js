'use strict';

const path = require(`path`);

const nodeExternals = require(`webpack-node-externals`);
const NodemonPlugin = require(`nodemon-webpack-plugin`);
const CopyPlugin = require(`copy-webpack-plugin`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);


module.exports = {
  entry: `./src/service/service.js`,
  mode: `development`,
  watch: true,
  output: {
    path: path.resolve(__dirname, `../dist/service`),
    filename: `index.js`
  },
  target: `node`,
  node: {
    __dirname: false,
    __filename: false,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new NodemonPlugin({
      watch: path.resolve(__dirname, `./dist/service`),
      nodeArgs: [
        `-r`,
        `pino-debug`,
        `-r`,
        `dotenv/config`,
      ],
      args: [
        `--server`,
        `|`,
        `./node_modules/.bin/pino-pretty`,
      ],
    }),
  ],
  resolve: {
    alias: {
      common: path.resolve(__dirname, `../src/common`),
      service: path.resolve(__dirname, `../src/service`),
    },
  },
  externals: [nodeExternals()],
};
