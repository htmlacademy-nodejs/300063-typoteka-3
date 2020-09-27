'use strict';

const {authenticationMiddleware, authenticationJwtMiddleware, schemaValidator, paramsValidator} = require(`../middleware`);
const {newArticleSchema, newCategorySchema, newComment, newUser, loginSchema, updatedArticleSchema} = require(`../schemas`);
const {getRouteParamsValidationSchema} = require(`../utils`);

const {ApiArticle} = require(`./article`);
const {ApiArticles} = require(`./articles`);
const {ApiCategories} = require(`./categories`);
const {ApiCategory} = require(`./category`);
const {ApiComments} = require(`./comments`);
const {ApiComment} = require(`./comment`);
const {ApiUser} = require(`./user`);
const {ApiUsers} = require(`./users`);
const {ApiLogin} = require(`./login`);
const {ApiLogout} = require(`./logout`);
const {ApiRefresh} = require(`./refresh`);


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
          post: [schemaValidator(loginSchema), authenticationMiddleware],
        },
      },
      {
        path: `logout`,
        Component: ApiLogout,
        middleware: {
          post: [authenticationJwtMiddleware],
        },
      },
      {
        path: `refresh`,
        Component: ApiRefresh,
      },
    ],
  }
];
