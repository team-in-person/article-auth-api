'use strict';

const articleModel = (sequelize, DataTypes) =>
  sequelize.define('Articles', {
    name: { type: DataTypes.STRING, required: true },
    content: { type: DataTypes.TEXT, required: true },
  });

module.exports = articleModel;
