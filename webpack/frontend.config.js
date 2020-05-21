'use strict';

const path = require(`path`);

const nodeExternals = require(`webpack-node-externals`);
const NodemonPlugin = require(`nodemon-webpack-plugin`);
const CopyPlugin = require(`copy-webpack-plugin`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);


module.exports = {
  entry: `./src/frontend/index.js`,
  mode: `development`,
  output: {
    path: path.resolve(__dirname, `../dist/frontend`),
    filename: `index.js`
  },
  target: `node`,
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: `src/frontend/templates`,
          to: `templates`,
        },
        {
          from: `src/frontend/public`,
          to: `public`,
        },
      ]
    }),
    new NodemonPlugin({
      watch: `./dist/frontend`,
      nodeArgs: [
        `-r`,
        `pino-debug`,
        `-r`,
        `dotenv/config`,
      ],
      args: [
        `|`,
        `./node_modules/.bin/pino-pretty`,
      ],
    }),
  ],
  resolve: {
    alias: {
      common: path.resolve(__dirname, `../src/common`),
      frontend: path.resolve(__dirname, `../src/frontend`),
    },
  },
  externals: [nodeExternals()],
};
