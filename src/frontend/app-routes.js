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
  checkServer,
  setUniqueFileName,
  checkUnauthorized,
  uploadFile,
} = require(`./middleware`);


module.exports = [
  {
    path: routeName.MAIN,
    Component: MainRoute,
    middleware: {
      all: [checkServer],
    },
  },
  {
    path: routeName.ARTICLES,
    middleware: {
      route: [checkServer],
    },
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
      route: [
        checkServer,
        checkAdmin
      ],
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
      all: [
        checkServer,
        checkUnauthorized
      ],
    },
  },
  {
    path: routeName.LOGOUT,
    Component: LogoutRoute,
    middleware: {
      all: [checkServer],
    },
  },
  {
    path: routeName.MY,
    Component: PublicationsRoute,
    middleware: {
      route: [
        checkServer,
        checkAdmin
      ],

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
      all: [
        checkServer,
        checkUnauthorized
      ],
      post: [
        uploadFile(`picture`),
        setUniqueFileName(`avatar`)
      ],
    }
  },
  {
    path: routeName.SEARCH,
    Component: SearchRoute,
    middleware: {
      all: [checkServer],
    },
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
