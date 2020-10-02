'use strict';

const {Sequelize, DataTypes} = require(`sequelize`);

const {logger} = require(`./utils`);
const config = require(`./sequelize-config`);
const {
  getAccountModel,
  getAccountTypeModel,
  getArticleModel,
  getCategoryModel,
  getCommentModel,
  EForeignKey,
  EModelName,
} = require(`./models`);


const sequelize = new Sequelize(config);

const Account = getAccountModel(sequelize, DataTypes);
const AccountType = getAccountTypeModel(sequelize, DataTypes);
const Article = getArticleModel(sequelize, DataTypes);
const Category = getCategoryModel(sequelize, DataTypes);
const Comment = getCommentModel(sequelize, DataTypes);

AccountType.hasMany(Account, {
  as: EModelName.ACCOUNTS,
  foreignKey: EForeignKey.ACCOUNT_TYPE_ID,
});
Account.belongsTo(AccountType, {
  as: EModelName.ACCOUNT_TYPES,
  foreignKey: EForeignKey.ACCOUNT_TYPE_ID,
});

Account.hasMany(Comment, {
  as: EModelName.COMMENTS,
  foreignKey: EForeignKey.ACCOUNT_ID,
});
Comment.belongsTo(Account, {
  as: EModelName.ACCOUNTS,
  foreignKey: EForeignKey.ACCOUNT_ID,
});

Article.hasOne(Comment, {
  as: EModelName.COMMENTS,
  foreignKey: EForeignKey.ARTICLE_ID,
});
Comment.belongsTo(Article, {
  as: EModelName.ARTICLES,
  foreignKey: EForeignKey.ARTICLE_ID,
});

Article.belongsToMany(Category, {
  through: EModelName.ARTICLE_CATEGORY,
  as: EModelName.CATEGORIES,
  foreignKey: EForeignKey.ARTICLE_ID,
  timestamps: false,
  paranoid: false,
});
Category.belongsToMany(Article, {
  through: EModelName.ARTICLE_CATEGORY,
  as: EModelName.ARTICLES,
  foreignKey: EForeignKey.CATEGORY_ID,
  timestamps: false,
  paranoid: false,
});


const initDb = async (force = false) => {
  logger.info(`DB is connecting...`);
  await sequelize.sync({force});
};

const disconnectDb = async () => {
  await sequelize.close();
};

module.exports = {
  db: {
    Account,
    AccountType,
    Article,
    Category,
    Comment,
  },
  sequelize,
  initDb,
  disconnectDb,
};
