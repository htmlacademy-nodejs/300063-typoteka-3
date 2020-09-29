'use strict';

const routeName = require(`./route-name`);

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
  setUniqueFileName,
  checkUnauthorized,
  uploadFile,
} = require(`./middleware`);


module.exports = [
  {
    path: routeName.MAIN,
    Component: MainRoute,
  },
  {
    path: routeName.ARTICLES,
    children: [
      {
        path: routeName.ADD,
        Component: AddArticleRoute,
        middleware: {
          all: [checkAdmin],
          post: [
            uploadFile(`picture`),
            setUniqueFileName(`image`)
          ],
        },
      },
      {
        path: `${routeName.EDIT}/:articleId`,
        Component: EditArticleRoute,
        middleware: {
          all: [checkAdmin],
          post: [
            uploadFile(`picture`),
            setUniqueFileName(`image`)
          ],
        },
      },
      {
        path: `${routeName.CATEGORY}/:categoryId`,
        Component: ArticlesByCategoryRoute,
      },
      {
        path: `:articleId`,
        Component: ArticleRoute,
      },
    ],
  },
  {
    path: routeName.CATEGORIES,
    Component: CategoriesRoute,
    middleware: {
      all: [checkAdmin],
    },
    children: [
      {
        path: `:categoryId`,
        Component: CategoryRoute,
      }
    ],
  },
  {
    path: routeName.LOGIN,
    Component: LoginRoute,
    middleware: {
      all: [checkUnauthorized],
    },
  },
  {
    path: routeName.LOGOUT,
    Component: LogoutRoute,
  },
  {
    path: routeName.MY,
    Component: PublicationsRoute,
    middleware: {
      all: [checkAdmin],

    },
    children: [
      {
        path: routeName.COMMENTS,
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
    path: routeName.REGISTER,
    Component: RegisterRoute,
    middleware: {
      all: [checkUnauthorized],
      post: [
        uploadFile(`picture`),
        setUniqueFileName(`avatar`)
      ],
    }
  },
  {
    path: routeName.SEARCH,
    Component: SearchRoute,
  },
  {
    path: routeName.NOT_FOUND,
    Component: NotFoundRoute,
  },
  {
    path: routeName.INTERNAL_SERVER_ERROR,
    Component: InternalServerErrorRoute,
  },
];
