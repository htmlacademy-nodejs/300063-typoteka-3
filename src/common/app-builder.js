'use strict';

const express = require(`express`);

const {ExitCode} = require(`./params`);


class AppBuilder {
  constructor(config) {
    this._config = config;
    this._methods = [`get`, `post`, `put`, `delete`];
    this._prefix = config.prefix ? `/${config.prefix}` : ``;

    this._build = this._build.bind(this);
    this._setAppSettings = this._setAppSettings.bind(this);
    this._setAppMiddlewares = this._setAppMiddlewares.bind(this);
    this._buildRoutes = this._buildRoutes.bind(this);
  }

  async getInstance() {
    if (!this._app) {
      this._app = express();
      await this._init();
      await this._build();
    }
    return this._app;
  }

  async destroyInstance() {
    this._config.close.async.forEach(async (func) => await func());
    this._config.close.sync.forEach((func) => func());
    this._app = null;
  }

  async _init() {
    const initParams = this._config.init;
    if (!initParams) {
      return;
    }
    if (initParams.async) {
      this._config.init.async.forEach(async (func) => await func());
    }
    if (initParams.sync) {
      this._config.init.sync.forEach((func) => func());
    }
  }

  async _build() {
    this._setAppSettings(this._config.settings);
    this._setAppMiddlewares(this._config.middlewares.before);
    this._buildRoutes(this._config.routes);
    this._setAppMiddlewares(this._config.middlewares.after);
  }

  _setAppSettings(settings) {
    if (!settings) {
      return;
    }
    settings.forEach((setting) => this._app.set(...setting));
  }

  _setAppMiddlewares(middlewares) {
    if (!middlewares) {
      return;
    }
    middlewares.forEach((middleware) => this._app.use(middleware));
  }

  _buildRoutes(routes, parentPath = this._prefix) {
    if (!routes) {
      console.error(`config.routes can't be empty`);
      process.exit(ExitCode.ERROR);
    }
    routes.forEach((route) => {
      route.path = `${parentPath}/${route.path}`;
      this._buildRoute(route);
      if (route.children) {
        this._buildRoutes(route.children, route.path);
      }
    });
  }

  _buildRoute(route) {
    const {path, Component} = route;
    if (!Component) {
      return;
    }
    const component = new Component();
    this._methods.forEach((method) => {
      if (!component[method]) {
        return;
      }
      const middlewares = this._getRouteMiddlewares(route.middleware, method);
      this._app[method](path, middlewares, component[method]);
    });
  }

  _getRouteMiddlewares(middleware = {}, method) {
    let result = [];
    if (middleware.all) {
      result = [...middleware.all];
    }
    if (middleware[method]) {
      result = [...result, ...middleware[method]];
    }
    return result;
  }
}

module.exports = AppBuilder;
