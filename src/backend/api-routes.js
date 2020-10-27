'use strict';

const routeName = require(`./route-name`);
const {
  ArticleRoute,
  ArticlesRoute,
  CategoriesRoute,
  CategoryRoute,
  CheckServerRoute,
  CommentsRoute,
  CommentRoute,
  UserRoute,
  UsersRoute,
  LoginRoute,
  LogoutRoute,
  RefreshRoute,
} = require(`./routes`);
const {
  authentication,
  authenticationJwt,
  checkAdmin,
  schemaValidator,
  paramsValidator,
} = require(`./middleware`);
const {newArticleSchema, newCategorySchema, newComment, newUser, loginSchema, updatedArticleSchema} = require(`./schemas`);
const {getRouteParamsValidationSchema} = require(`./utils`);


const routeArticleIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`articleId`]));
const routeCommentIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`commentId`]));
const routeUserIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`userId`]));
const routeCategoryIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`categoryId`]));

module.exports = [
  {
    path: routeName.ARTICLES,
    Component: ArticlesRoute,
    middleware: {
      post: [
        authenticationJwt,
        checkAdmin,
        schemaValidator(newArticleSchema)
      ],
    },
    children: [
      {
        path: `:articleId`,
        Component: ArticleRoute,
        middleware: {
          get: [routeArticleIdParamsValidationMiddleware],
          put: [
            authenticationJwt,
            checkAdmin,
            routeArticleIdParamsValidationMiddleware,
            schemaValidator(updatedArticleSchema)
          ],
          delete: [
            authenticationJwt,
            checkAdmin,
            routeArticleIdParamsValidationMiddleware
          ],
        },
      }
    ],
  },
  {
    path: routeName.CATEGORIES,
    Component: CategoriesRoute,
    middleware: {
      post: [
        authenticationJwt,
        checkAdmin,
        schemaValidator(newCategorySchema)
      ],
    },
    children: [
      {
        path: `:categoryId`,
        Component: CategoryRoute,
        middleware: {
          put: [
            authenticationJwt,
            checkAdmin,
            routeCategoryIdParamsValidationMiddleware,
            schemaValidator(newCategorySchema)
          ],
          delete: [
            authenticationJwt,
            checkAdmin,
            routeCategoryIdParamsValidationMiddleware
          ],
        }
      }
    ],
  },
  {
    path: routeName.COMMENTS,
    Component: CommentsRoute,
    middleware: {
      post: [
        authenticationJwt,
        schemaValidator(newComment)
      ],
    },
    children: [
      {
        path: `:commentId`,
        Component: CommentRoute,
        middleware: {
          delete: [
            authenticationJwt,
            checkAdmin,
            routeCommentIdParamsValidationMiddleware
          ],
        }
      }
    ],
  },
  {
    path: routeName.USER,
    Component: UsersRoute,
    middleware: {
      post: [schemaValidator(newUser)]
    },
    children: [
      {
        path: `:userId`,
        Component: UserRoute,
        middleware: {
          get: [routeUserIdParamsValidationMiddleware],
        }
      },
      {
        path: routeName.LOGIN,
        Component: LoginRoute,
        middleware: {
          post: [schemaValidator(loginSchema), authentication],
        },
      },
      {
        path: routeName.LOGOUT,
        Component: LogoutRoute,
        middleware: {
          post: [authenticationJwt],
        },
      },
      {
        path: routeName.REFRESH,
        Component: RefreshRoute,
      },
    ],
  },
  {
    path: routeName.CHECK,
    children: [
      {
        path: routeName.SERVER,
        Component: CheckServerRoute,
      }
    ],
  }
];
