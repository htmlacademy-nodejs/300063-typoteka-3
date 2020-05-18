'use strict';

const path = require(`path`);

const nodeExternals = require(`webpack-node-externals`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);


module.exports = {
  entry: `./src/service/service.js`,
  mode: `production`,
  output: {
    path: path.resolve(__dirname, `../build/service`),
    filename: `index.js`
  },
  target: `node`,
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  resolve: {
    alias: {
      common: path.resolve(__dirname, `../src/common`),
      service: path.resolve(__dirname, `../src/service`),
    },
  },
  externals: [nodeExternals()],
};
