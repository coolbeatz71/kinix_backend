'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      /**
       * bookmark association
       */
      Article.hasMany(models.Bookmark, {
        foreignKey: 'articleId',
        sourceKey: 'id',
      });

      /**
       * like association
       */
      Article.hasMany(models.Like, {
        foreignKey: 'articleId',
        sourceKey: 'id',
      });
    }
  }

  Article.init(
    {
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 100,
        },
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          min: 100,
          max: 300,
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      video: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      reads: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      liked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'article',
      modelName: 'Article',
    },
  );
  return Article;
};
