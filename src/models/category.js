'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      /**
       * user association
       */
      Category.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      /**
       * article association
       */
      Category.belongsTo(models.Article, {
        foreignKey: 'articleId',
        targetKey: 'id',
      });
    }
  }

  Category.init(
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
      tableName: 'category',
      modelName: 'Category',
    },
  );
  return Category;
};
