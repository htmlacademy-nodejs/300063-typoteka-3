'use strict';

const request = require(`supertest`);

const AppBuilder = require(`./app-builder`);


const getComponent = (key, callback = () => {}) => {
  class TestComponent {
    async get(req, res) {
      callback();
      res.json({key});
    }

    async post(req, res) {
      callback();
      res.json({key});
    }
  }
  return TestComponent;
};


const testMiddleware = (callback) => (req, res, next) => {
  callback();
  next();
};

const prefix = `test`;
const init = {
  sync: [],
  async: [],
};
const destroy = {
  sync: [],
  async: [],
};
const middleware = {
  before: [],
  after: [],
};
const routes = [
  {
    path: `/`, Component: getComponent(`/`)
  }
];
const config = {
  init,
  destroy,
  middleware,
  routes,
};

describe(`App Builder test`, () => {
  test(`should set config`, () => {
    const appContainer = new AppBuilder(config);
    expect(appContainer._config).toEqual(config);
  });

  describe(`prefix param`, () => {
    test(`should add prefix to route`, async () => {
      const testConfig = {...config};
      testConfig.prefix = prefix;
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      const res = await request(app).get(`/${prefix}`);
      expect(res.statusCode).toBe(200);
    });

    test(`status code should be 400 when request without prefix`, async () => {
      const testConfig = {...config};
      testConfig.prefix = prefix;
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      const res = await request(app).get(`/`);
      expect(res.statusCode).toBe(404);
    });

    test(`app should work without prefix param`, async () => {
      const testConfig = {...config};
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      const res = await request(app).get(`/`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe(`init params`, () => {
    test(`should call sync init functions`, async () => {
      const testFunction = jest.fn();
      config.init.sync = [testFunction];
      const appContainer = new AppBuilder(config);
      await appContainer.getInstance();
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should call async init functions`, async () => {
      const testFunction = jest.fn();
      config.init.async = [testFunction];
      const appContainer = new AppBuilder(config);
      await appContainer.getInstance();
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should work without init param`, async () => {
      const testConfig = {...config};
      delete testConfig.init;
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      expect(app).toBeTruthy();
    });

    test(`should work without sync init param`, async () => {
      const testConfig = {...config};
      delete testConfig.init.sync;
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      expect(app).toBeTruthy();
    });

    test(`should work without async init param`, async () => {
      const testConfig = {...config};
      delete testConfig.init.async;
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      expect(app).toBeTruthy();
    });
  });

  describe(`destroy params`, () => {
    test(`should call sync destroy functions`, async () => {
      const testFunction = jest.fn();
      config.destroy.sync = [testFunction];
      const appContainer = new AppBuilder(config);
      await appContainer.getInstance();
      await appContainer.destroyInstance();
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should call async destroy functions`, async () => {
      const testFunction = jest.fn();
      config.destroy.async = [testFunction];
      const appContainer = new AppBuilder(config);
      await appContainer.getInstance();
      await appContainer.destroyInstance();
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should work without destroy param`, async () => {
      const testConfig = {...config};
      delete testConfig.destroy;
      const appContainer = new AppBuilder(testConfig);
      await appContainer.getInstance();
      await appContainer.destroyInstance();
      expect(appContainer._app).toBeNull();
    });

    test(`should work without sync destroy param`, async () => {
      const testConfig = {...config};
      delete testConfig.destroy.sync;
      const appContainer = new AppBuilder(testConfig);
      await appContainer.getInstance();
      await appContainer.destroyInstance();
      expect(appContainer._app).toBeNull();
    });

    test(`should work without async destroy param`, async () => {
      const testConfig = {...config};
      delete testConfig.destroy.async;
      const appContainer = new AppBuilder(testConfig);
      await appContainer.getInstance();
      await appContainer.destroyInstance();
      expect(appContainer._app).toBeNull();
    });
  });

  describe(`middleware params`, () => {
    test(`should call before app middleware when finding route`, async () => {
      const testConfig = {...config};
      const testFunction = jest.fn();
      testConfig.middleware.before = [testMiddleware(testFunction)];
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      await request(app).get(`/`);
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should work without before app middleware when finding route`, async () => {
      const testConfig = {...config};
      delete testConfig.middleware.before;
      const testFunction = jest.fn();
      testConfig.routes = [
        {path: `/`, Component: getComponent(`test`, testFunction)}
      ];
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      await request(app).get(`/`);
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should call after app middleware when route doesn't exist`, async () => {
      const testConfig = {...config};
      const testFunction = jest.fn();
      testConfig.middleware.after = [testMiddleware(testFunction)];
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      await request(app).get(`/not-exist-route`);
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should work without before app middleware when finding route`, async () => {
      const testConfig = {...config};
      delete testConfig.middleware.after;
      const testFunction = jest.fn();
      testConfig.routes = [
        {path: `/`, Component: getComponent(`test`, testFunction)}
      ];
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      await request(app).get(`/`);
      expect(testFunction).toBeCalledTimes(1);
    });

    test(`should work without app middleware`, async () => {
      const testConfig = {...config};
      delete testConfig.middleware;
      const testFunction = jest.fn();
      testConfig.routes = [
        {path: `/`, Component: getComponent(`test`, testFunction)}
      ];
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      await request(app).get(`/`);
      expect(testFunction).toBeCalledTimes(1);
    });
  });

  describe(`routes params`, () => {
    test(`shouldn't work without routes param`, async () => {
      const testConfig = {...config};
      delete testConfig.routes;
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      expect(app).toBeNull();
    });

    test.each([
      `/main`,
      `/main/test1`,
      `/main/test1/test2`,
      `/main/test1/test2/test3`
    ])(`children should create routes any nested %p`, async (route) => {
      const testConfig = {...config};
      testConfig.routes = [
        {
          path: `main`,
          Component: getComponent(`main`),
          children: [
            {
              path: `test1`,
              Component: getComponent(`test1`),
              children: [
                {
                  path: `test2`,
                  Component: getComponent(`test2`),
                  children: [
                    {
                      path: `test3`,
                      Component: getComponent(`test3`),
                    },
                  ]
                },
              ]
            },
          ]
        }
      ];
      const appContainer = new AppBuilder(testConfig);
      const app = await appContainer.getInstance();
      const res = await request(app).get(route);
      expect(res.statusCode).toBe(200);
    });

    describe(`route middleware`, () => {
      test(`all route middleware should set middleware to only current route methods`, async () => {
        const testConfig = {...config};
        const testFunction = jest.fn();
        testConfig.routes = [
          {
            path: `main`,
            Component: getComponent(`main`),
            middleware: {
              all: [testMiddleware(testFunction)]
            },
          }
        ];
        const appContainer = new AppBuilder(testConfig);
        const app = await appContainer.getInstance();
        await request(app).get(`/main`);
        await request(app).post(`/main`);
        expect(testFunction).toBeCalledTimes(2);
      });

      test(`all route middleware shouldn't set middleware to nested routes`, async () => {
        const testConfig = {...config};
        const testFunction = jest.fn();
        testConfig.routes = [
          {
            path: `main`,
            Component: getComponent(`main`),
            middleware: {
              all: [testMiddleware(testFunction)]
            },
            children: [
              {
                path: `test1`,
                Component: getComponent(`test1`),
              },
            ]
          }
        ];
        const appContainer = new AppBuilder(testConfig);
        const app = await appContainer.getInstance();
        await request(app).get(`/main/test1`);
        await request(app).post(`/main/test1`);
        expect(testFunction).toBeCalledTimes(0);
      });

      test.each([
        `/main/test1`,
        `/main/test1/test2`,
        `/main/test1/test2/test3`
      ])(`route middleware should set middleware to any nested routes %p`, async (route) => {
        const testConfig = {...config};
        const testFunction = jest.fn();
        testConfig.routes = [
          {
            path: `main`,
            Component: getComponent(`main`),
            middleware: {
              route: [testMiddleware(testFunction)]
            },
            children: [
              {
                path: `test1`,
                Component: getComponent(`test1`),
                children: [
                  {
                    path: `test2`,
                    Component: getComponent(`test2`),
                    children: [
                      {
                        path: `test3`,
                        Component: getComponent(`test3`),
                      },
                    ],
                  },
                ],
              },
            ],
          }
        ];
        const appContainer = new AppBuilder(testConfig);
        const app = await appContainer.getInstance();
        await request(app).get(route);
        await request(app).post(route);
        expect(testFunction).toBeCalledTimes(2);
      });

      test(`method route middleware should set middleware to only get method`, async () => {
        const testConfig = {...config};
        const testFunction = jest.fn();
        testConfig.routes = [
          {
            path: `main`,
            Component: getComponent(`main`),
            middleware: {
              get: [testMiddleware(testFunction)]
            },
          }
        ];
        const appContainer = new AppBuilder(testConfig);
        const app = await appContainer.getInstance();
        await request(app).get(`/main`);
        expect(testFunction).toBeCalledTimes(1);
        await request(app).post(`/main`);
        expect(testFunction).toBeCalledTimes(1);
      });
    });
  });
});
