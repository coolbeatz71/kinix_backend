'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Bookmark extends Model {
    static associate(models) {
      /**
       * user association
       */
      Bookmark.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      /**
       * article association
       */
      Bookmark.belongsTo(models.Article, {
        foreignKey: 'articleId',
        targetKey: 'id',
      });
    }
  }

  Bookmark.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'bookmark',
      modelName: 'Bookmark',
    },
  );
  return Bookmark;
};
