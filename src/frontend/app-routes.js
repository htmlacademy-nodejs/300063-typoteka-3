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
const {checkAdminMiddleware, queryParamsMiddleware, unauthorizedMiddleware} = require(`./middleware`);
const {upload} = require(`./utils`);


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
          all: [checkAdminMiddleware],
          get: [queryParamsMiddleware([`errorMessages`, `article`])],
          post: [upload(`picture`)],
        },
      },
      {
        path: `edit/:articleId`,
        Component: EditArticleRoute,
        middleware: {
          all: [checkAdminMiddleware],
          get: [queryParamsMiddleware([`errorMessages`, `article`])],
          post: [upload(`picture`)],
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
          get: [queryParamsMiddleware([`errorMessages`, `comment`])]
        }
      },
    ],
  },
  {
    path: `categories`,
    Component: CategoriesRoute,
    middleware: {
      all: [checkAdminMiddleware],
      get: [queryParamsMiddleware([`updatedCategory`, `createdCategory`, `errorMessages`])],
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
      all: [unauthorizedMiddleware],
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
      all: [checkAdminMiddleware],

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
      all: [unauthorizedMiddleware],
      get: [queryParamsMiddleware([`errorMessages`, `user`])],
      post: [upload(`picture`)],
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
