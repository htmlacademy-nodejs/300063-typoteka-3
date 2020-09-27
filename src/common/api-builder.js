'use strict';

const express = require(`express`);

const {ExitCode} = require(`./params`);


class ApiBuilder {
  constructor(config) {
    this._config = config;
    this._methods = [`get`, `post`, `put`, `delete`];
    this._build = this._build.bind(this);
    this._setAppSettings = this._setAppSettings.bind(this);
    this._setAppMiddlewares = this._setAppMiddlewares.bind(this);
    this._buildRoutes = this._buildRoutes.bind(this);
  }

  async getInstance() {
    if (!this._app) {
      this._app = express();
      await this._build();
    }
    return this._app;
  }

  async close() {
    this._config.close.async.forEach(async (func) => await func());
    this._config.close.sync.forEach((func) => func());
    this._app = null;
  }

  async _build() {
    this._prefix = this._config.prefix ? `/${this._config.prefix}` : ``;
    await this._init();
    this._setAppSettings(this._config.settings);
    this._setAppMiddlewares(this._config.middlewares.before);
    this._buildRoutes(this._config.routes);
    this._setAppMiddlewares(this._config.middlewares.after);
  }

  async _init() {
    if (this._config.init && this._config.init.async) {
      this._config.init.async.forEach(async (func) => await func());
    }
    if (this._config.init && this._config.init.sync) {
      this._config.init.sync.forEach((func) => func());
    }
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

      let params = [path, component[method]];
      if (route.middleware) {
        let middleware = [];
        if (route.middleware.all) {
          middleware = [...route.middleware.all];
        }
        if (route.middleware[method]) {
          middleware = [...middleware, ...route.middleware[method]];
        }
        params = [path, middleware, component[method]];
      }
      this._app[method](...params);
    });
  }
}

module.exports = ApiBuilder;
