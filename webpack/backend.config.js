'use strict';

const path = require(`path`);

const nodeExternals = require(`webpack-node-externals`);
const NodemonPlugin = require(`nodemon-webpack-plugin`);
const CopyPlugin = require(`copy-webpack-plugin`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);


module.exports = (env, argv) => {
  const config = {
    entry: `./src/service/service.js`,
    mode: `development`,
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
    ],
    resolve: {
      alias: {
        common: path.resolve(__dirname, `../src/common`),
        service: path.resolve(__dirname, `../src/service`),
      },
    },
    externals: [nodeExternals()],
  };
  if (!argv) {
    config.plugins = [
      ...config.plugins,
      new NodemonPlugin({
        watch: `./dist/service`,
        args: [`--server`],
      }),
    ];
    return config;
  }
  config.mode = argv.mode || config.mode;
  if (config.mode === `development`) {
    config.devtool = `source-map`;
  }

  if (argv.notest) {
    config.plugins = [
      ...config.plugins,
      new NodemonPlugin({
        watch: `./dist/service`,
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
    ];
  }
  return config;
};
