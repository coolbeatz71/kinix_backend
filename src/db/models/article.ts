'use strict';
import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUnknownObject } from '../../interfaces/UnknownObject';

interface IArticle {
  readonly id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  images: string[] | null;
  video: string[] | null;
  reads: number;
  tags: string[] | null;
  liked: boolean;
  likeCount: number;
}

module.exports = (sequelize: Sequelize) => {
  class Article extends Model<IArticle> implements IArticle {
    readonly id!: number;
    slug!: string;
    title!: string;
    summary!: string;
    body!: string;
    images!: string[] | null;
    video!: string[] | null;
    reads!: number;
    tags!: string[] | null;
    liked!: boolean;
    likeCount!: number;

    static associate(models: IUnknownObject) {
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
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
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
      timestamps: true,
      tableName: 'article',
      modelName: 'Article',
    },
  );
  return Article;
};
