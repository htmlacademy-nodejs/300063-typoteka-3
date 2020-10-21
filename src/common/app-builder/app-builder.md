# Описание App Builder
`AppBuilder` - это билдер приложений строящихся на основе конфигурационного файла.
Создан на базе [фреймворка express](https://expressjs.com/)



## Шаги создание приложения с помощью AppBuilder-а
1. описать конфигурацию
2. на основе конфигурации создать экремпляр класса AppBuilder:
  ```js
    const appContainer = new AppBuilder(config)
  ```
   
3. получить экземпляр приложения:
  ```js
    (async () => {
     const app = await appContainer.getInstance();
    })();
  ```
4. подключиться к порту:
  ```js
    (async () => {
       const app = await appContainer.getInstance();
       app.listen(port, () => console.log(`Сервер подключен на порту ${port}`))
         .on(`error`, (error) => console.log(`Произошла ошибка подключения сервера к порту ${port}`));  
    })();
  ```



## Параметры конфигурации
* [prifix](#prefix)
* [init](#init)
* [destroy](#destroy)
* [settings](#settings)
* [middleware](#middleware)
* [routes](#routes)


### <a name="#prefix"></a>prefix
Позволяет добавить ко всем end-point префикс, например если в конфигурации описано несколько роутов с путями:
- `/articles`;
- `/articles/add`;
- `/users`.

При добавлении параметра `prefix` со значение `api` вышеуказанные пути изменятся на:
- `/api/articles`;
- `/api/articles/add`;
- `/api/users`.


### <a name="#init"></a>init
Может принимать массивы с функциями, которые будут вызываться перед созданием экземпляра приложения,
это может быть необходимо например для подключения к базе данных

- `sync` массив с синхронными функциями;
- `async` массив с асинхронными функциями.

Конфигурация может выглядеть следующим образом:
  ```js
    const {initDb} = require(`./utils`);

    const config = {
      prefix: `api`,
      init: {
        sync: [() => {
          console.log(`Инициализация приложения`);
        }],
        async: [async () => {
          console.log(`Подключение к базе данных...`);
          await initDb();
          console.log(`База данных подключена`);
        }],
      },
      routes: [...],
    };
  ```


### <a name="#destroy"></a>destroy
Позволяет выполнить действия при уничтожении инстанса, например отключение базы данных, удаление директорий и т.д.

- `sync` массив с синхронными функциями;
- `async` массив с асинхронными функциями.

Конфигурация может выглядеть следующим образом:
  ```js
    const {disconnectDb} = require(`./utils`);

    const config = {
      prefix: `api`,
      init: {...},
      destroy: {
        sync: [() => {
          console.log(`Удаление инстанса приложения`);
        }],
        async: [async () => {
          console.log(`Отключение от базы данных...`);
          await disconnectDb();
          console.log(`База данных отключена`);
        }],
      },
      routes: [...],
    };
  ```


### <a name="#settings"></a>settings
Массив настроек, например для SSR можно подключить движек шаблонов Pug:
  ```js
    const config = {
      prefix: `api`,
      init: {...},
      settings: [
        [`views`, path.resolve(__dirname, `templates`)],
        [`view engine`, `pug`]
      ],
      destroy: {...},
      routes: [...],      
    }
  ```


### <a name="#middleware"></a>middleware
Параметр позволяющий добавлять middleware для всего приложения
- `before` - массив с middleware, которые нужны для работы всего приложения и их необходимо запустить перед выполнением
каких-то действий на сервере, например для SSR приложения нужно брать файлы стилей, шрифтов,
изображений и т.д. Для этого можно указать middleware express.static
- `routes` - массив с middleware, которые нужны непостредственно при работе роутов, например на каждой странице
SSR приложения, может выполнять проверка токена доступа с последующим получение информации об аккаунте
пользователя (аватар, имя, фамилия и т.д) с целью отображения этой информации на отдаваемой пользователю странице или
совержения каких либо пользовательских действий, но при этом не нужно, чтобы этот middleware срабатывал на запросы для
получения каких-то статических данных.
- `after` массив с middleware которые срабатывают, если нет подходящего роута или произошла какая-то ошибка.

Конфигурация может выглядеть следующим образом:
  ```js
    const express = require(`express`);
    const {getAccountByToken, notFound, internalServerError} = require(`./middleware`);

    const config = {
      prefix: `api`,
      init: {...},
      destroy: {...},
      middleware: {
        before: [express.static(path.resolve(__dirname, `public`))],
        routes: [getAccountByToken],
        after: [notFound, internalServerError],
      },
      routes: [...],
    };
  ```


### <a name="#routes"></a>routes
Массив содержащий объекты, которые описывают роуты приложения (обязательный параметр,
должен содержать хотябы 1 объект описывающий маршрут)

#### path
путь до роута

#### Component
класс, опционально содержащий методы (`get`, `post`, `put`, `delete`) для формирования end-point-ов;
может выглядеть следующим образом:
  ```js
    class ApiArticles {
      constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
      }

      async get(req, res) {
        //обработка GET запроса
        res.status(200).send(`Результат запроса`);
      }

      async post(req, res) {
        //обработка POST запроса
        res.status(201).send(`Результат создания публикации`);
      }
    }
  ```

#### children
массив вложенных роутов;

#### middleware
объект, содержащий массивы middleware, позволяющий гибко настраивать роуты
- `get` - массив middleware, задает middleware только для GET метода текущего марштута (также есть методы `post`, `put`,
`delete` позволяющие задавать middleware на одноименные методы маршрута);
- `all` - массив, распространяющий middleware на все использующиеся методы в пределах end-point-а не распространяясь
вглубь по дереву вложенности (`children`);
- `route` - массив, распространяющий middleware на все использующиеся методы и вглубь по дереву вложенности (`children`);

Пример:
  ```js
    const {checkAuth, checkAdmin} = require(`./middleware`);
    const {ApiArticle, ApiArticles, ApiMain, ApiMy} = require(`./api`);

    const config = {
      prefix: `api`,
      init: {...},
      destroy: {...},
      middleware: {...},
      routes: [
        {
          path: `main`,
          Component: ApiMain,
          middleware: {
            all: [checkServer],
            get: [checkAuth],
          },
          children: [
            {
              path: `my`,
              Component: ApiMy,
            },
          ],
        },
        {
          path: `articles`,
          Component: ApiArticles,
          middleware: {
            route: [checkAdmin],
            get: [checkAuth],
          },
          children: [
            {
              path: `:articleId`,
              Component: ApiArticle,
              middleware: {
                put: [checkAuth],
                delete: [checkAuth],
              },
            },
          ],
        }
      ],
    };
  ```
В коде выше создаётся 3 маршрута:
- `/api/main` - обработка запросов происходит в экземпляре класса `ApiMain`
- `/api/main/my` - обработка запросов происходит в экземпляре класса `ApiMy`
- `/api/articles` - обработка запросов происходит в экземпляре класса `ApiArticles`
- `/api/articles/:articleId` - обработка запросов происходит в экземпляре класса `ApiArticle`

Если предположить, что в описанной выше конфигурации,
у класса `ApiMain` есть обработчики на методы `GET`, `POST`, `PUT` и `DELETE`,
у `ApiMy` на метод `GET`,
у `ApiArticles` на методы `GET` и `POST`,
а у `ApiArticle` на методы `PUT` и `DELETE`, то middleware распределятся следующим образом:
- `checkServer` - будет происходить перед обработкой запросов на все методы класса `ApiMain` (на обработчики класса
`ApiMy` он распространятся не будет);
- `checkAuth` - произойдет перед обработкой методов `GET` у классов `ApiMain` и `ApiArticles`, а также у обработчиков
маршрута для методов `PUT` и `DELETE` у класса `ApiArticle`;
- `checkAdmin` - выполнится перед всеми обработчиками методов класса `ApiArticles` и вложенных маршрутов, в примере выше
для `ApiArticles` есть только 1 вложенный маршрут `ApiArticle` и `checkAdmin` распространится на все его методы,
более того если бы у `ApiArticle` появились потомки, то `checkAdmin` распространился бы и на них.
