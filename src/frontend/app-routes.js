'use strict';

const {
  AddArticleRoute,
  ArticleRoute,
  ArticlesByCategoryRoute,
  CategoriesRoute,
  CategoryRoute,
  CommentRoute,
  CommentsRoute,
  EditArticleRoute,
  InternalServerErrorRoute,
  LoginRoute,
  LogoutRoute,
  MainRoute,
  NotFoundRoute,
  PublicationsRoute,
  RegisterRoute,
  SearchRoute,
} = require(`./routes`);
const {
  checkAdmin,
  parseQueryParams,
  setUniqueFileName,
  checkUnauthorized,
  uploadFile,
} = require(`./middleware`);


module.exports = [
  {
    path: `/`,
    Component: MainRoute,
  },
  {
    path: `articles`,
    children: [
      {
        path: `add`,
        Component: AddArticleRoute,
        middleware: {
          all: [checkAdmin],
          get: [parseQueryParams([`errorMessages`, `article`])],
          post: [
            uploadFile(`picture`),
            setUniqueFileName(`image`)
          ],
        },
      },
      {
        path: `edit/:articleId`,
        Component: EditArticleRoute,
        middleware: {
          all: [checkAdmin],
          get: [parseQueryParams([`errorMessages`, `article`])],
          post: [
            uploadFile(`picture`),
            setUniqueFileName(`image`)
          ],
        },
      },
      {
        path: `category/:categoryId`,
        Component: ArticlesByCategoryRoute,
      },
      {
        path: `:articleId`,
        Component: ArticleRoute,
        middleware: {
          get: [parseQueryParams([`errorMessages`, `comment`])]
        }
      },
    ],
  },
  {
    path: `categories`,
    Component: CategoriesRoute,
    middleware: {
      all: [checkAdmin],
      get: [parseQueryParams([`updatedCategory`, `createdCategory`, `errorMessages`])],
    },
    children: [
      {
        path: `:categoryId`,
        Component: CategoryRoute,
      }
    ],
  },
  {
    path: `login`,
    Component: LoginRoute,
    middleware: {
      all: [checkUnauthorized],
    },
  },
  {
    path: `logout`,
    Component: LogoutRoute,
  },
  {
    path: `my`,
    Component: PublicationsRoute,
    middleware: {
      all: [checkAdmin],

    },
    children: [
      {
        path: `comments`,
        Component: CommentsRoute,
        children: [
          {
            path: `:commentId`,
            Component: CommentRoute,
          }
        ]
      }
    ]
  },
  {
    path: `register`,
    Component: RegisterRoute,
    middleware: {
      all: [checkUnauthorized],
      get: [parseQueryParams([`errorMessages`, `user`])],
      post: [
        uploadFile(`picture`),
        setUniqueFileName(`avatar`)
      ],
    }
  },
  {
    path: `search`,
    Component: SearchRoute,
  },
  {
    path: `not-found`,
    Component: NotFoundRoute,
  },
  {
    path: `internal-server-error`,
    Component: InternalServerErrorRoute,
  },
];
