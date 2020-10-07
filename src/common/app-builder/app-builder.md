# Описание App Builder
`AppBuilder` - это конфигуратор приложений строящихся на основе конфигурационного файла.
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



## Параметры конфигурации
Для запуска приложения обязательно должен быть описан параметр `routes` в котором должен быть хотя бы 1 роут,
все остальные параметры являются необязательными/


### prefix
Позволяет добавить ко всем end-point префикс, например если в конфигурации описано несколько роутов с путями:
- `/articles`;
- `/articles/add`;
- `/users`.

При добавлении параметра `prefix` со значение `api` вышеуказанные пути изменятся на:
- `/api/articles`;
- `/api/articles/add`;
- `/api/users`.


### init
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


### destroy
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


### middleware
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


### routes
Массив содержащий объекты, которые описываю роуты приложения (обязательный параметр, должен содержать хотябы объект)

#### path
путь до роута

#### Component
класс, опционально содержащий методы (`get`, `post`, `put`, `delete`) для формирования end-point-ов;

#### children
массив вложенных роутов;

#### middleware
объект, содержащий массивы middleware, позволяющий гибко настраивать роуты
- `get` - массив middleware, задает middleware только для GET метода текущего роута (также есть методы `post`, `put`,
`delete` позволяющие задавать middleware на одноименные методы);
- `all` - массив, распространяющий middleware на все использующиеся методы в пределах end-point-а не распространяясь
вглубь по дереву наследников
- `route` - массив, распространяющий middleware на все использующиеся методы и вглубь по дереву наследников;

Пример:
  ```js
    const {checkAuth, checkAdmin} = require(`./middleware`);
    const {ApiArticle, ApiArticles, ApiMain} = require(`./api`);

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
            post: [checkAdmin],
          },
        },
        {
          path: `articles`,
          Component: ApiArticles,
          middleware: {
            route: [checkAdmin],
            get: [checkAuth],
            post: [checkAdmin],
          },
          children: [
            {
              path: `:id`,
              Component: ApiArticle,
              middleware: {
                put: [checkAuth],
                delete: [checkAdmin],
              },
            },
          ],
        }
      ],
    };
  ```

