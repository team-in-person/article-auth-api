'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const articleModel = require('./article.js');
const userModel = require('../auth/models/users.js');
const Collection = require('./data-collections.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory';

const DATABASE_CONFIG = { logging: false };

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const article = articleModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  article: new Collection(article),
  users: new Collection(users),
};
