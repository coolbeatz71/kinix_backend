'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      /**
       * article association
       */
      Like.belongsTo(models.Article, {
        foreignKey: 'articleId',
        targetKey: 'id',
      });

      /**
       * user association
       */
      Like.belongsTo(models.User, {
        foreignKey: 'articleId',
        targetKey: 'id',
      });
    }
  }

  Like.init(
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
      tableName: 'like',
      modelName: 'Like',
    },
  );
  return Like;
};
