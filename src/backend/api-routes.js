'use strict';

const {
  ApiArticle,
  ApiArticles,
  ApiCategories,
  ApiCategory,
  ApiComments,
  ApiComment,
  ApiUser,
  ApiUsers,
  ApiLogin,
  ApiLogout,
  ApiRefresh,
} = require(`./routes`);
const {authentication, authenticationJwt, schemaValidator, paramsValidator} = require(`./middleware`);
const {newArticleSchema, newCategorySchema, newComment, newUser, loginSchema, updatedArticleSchema} = require(`./schemas`);
const {getRouteParamsValidationSchema} = require(`./utils`);


const routeArticleIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`articleId`]));
const routeCommentIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`commentId`]));
const routeUserIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`userId`]));
const routeCategoryIdParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`categoryId`]));

module.exports = [
  {
    path: `articles`,
    Component: ApiArticles,
    middleware: {
      post: [schemaValidator(newArticleSchema)],
    },
    children: [
      {
        path: `:articleId`,
        Component: ApiArticle,
        middleware: {
          get: [routeArticleIdParamsValidationMiddleware],
          put: [
            routeArticleIdParamsValidationMiddleware,
            schemaValidator(updatedArticleSchema)
          ],
          delete: [routeArticleIdParamsValidationMiddleware],
        },
      }
    ],
  },
  {
    path: `categories`,
    Component: ApiCategories,
    middleware: {
      post: [schemaValidator(newCategorySchema)],
    },
    children: [
      {
        path: `:categoryId`,
        Component: ApiCategory,
        middleware: {
          put: [
            routeCategoryIdParamsValidationMiddleware,
            schemaValidator(newCategorySchema)
          ],
          delete: [routeCategoryIdParamsValidationMiddleware],
        }
      }
    ],
  },
  {
    path: `comments`,
    Component: ApiComments,
    middleware: {
      post: [schemaValidator(newComment)],
    },
    children: [
      {
        path: `:commentId`,
        Component: ApiComment,
        middleware: {
          delete: [routeCommentIdParamsValidationMiddleware]
        }
      }
    ],
  },
  {
    path: `user`,
    Component: ApiUsers,
    middleware: {
      post: [schemaValidator(newUser)]
    },
    children: [
      {
        path: `:userId`,
        Component: ApiUser,
        middleware: {
          get: [routeUserIdParamsValidationMiddleware],
        }
      },
      {
        path: `login`,
        Component: ApiLogin,
        middleware: {
          post: [schemaValidator(loginSchema), authentication],
        },
      },
      {
        path: `logout`,
        Component: ApiLogout,
        middleware: {
          post: [authenticationJwt],
        },
      },
      {
        path: `refresh`,
        Component: ApiRefresh,
      },
    ],
  }
];
