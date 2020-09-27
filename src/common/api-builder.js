'use strict';

const express = require(`express`);


class ApiBuilder {
  constructor(config) {
    this._config = config;
    this._methods = [`get`, `post`, `put`, `delete`];
    this._build = this._build.bind(this);
    this._buildRoutes = this._buildRoutes.bind(this);
    this._setAppMiddlewares = this._setAppMiddlewares.bind(this);
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

  _setAppMiddlewares(middlewares) {
    if (!middlewares) {
      return;
    }
    middlewares.forEach((middleware) => this._app.use(middleware));
  }

  async _build() {
    this._prefix = this._config.prefix ? `/${this._config.prefix}` : ``;
    await this._init();
    this._setAppMiddlewares(this._config.middlewares.before);
    this._buildRoutes(this._config.routes);
    this._setAppMiddlewares(this._config.middlewares.after);
  }

  async _init() {
    this._config.init.async.forEach(async (func) => await func());
    this._config.init.sync.forEach((func) => func());
  }

  _buildRoutes(routes, parentPath = this._prefix) {
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
