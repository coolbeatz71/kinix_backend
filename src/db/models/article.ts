import { Model, Sequelize, DataTypes } from 'sequelize';
import { IArticle, IModel } from '../../interfaces/model';

export default class Article extends Model<IArticle> implements IArticle {
  readonly id!: number;
  slug!: string;
  title!: string;
  summary!: string;
  body!: string;
  images!: string[] | null;
  video!: string[] | null;
  reads!: number;
  tags!: string[] | null;
  active!: boolean;
  liked!: boolean;
  likeCount!: number;
  userId!: number;

  static associate(models: IModel) {
    /**
     * bookmark association
     */
    Article.hasMany(models.Bookmark, {
      as: 'bookmark',
      foreignKey: 'articleId',
      sourceKey: 'id',
    });

    /**
     * like association
     */
    Article.hasMany(models.Like, {
      as: 'like',
      foreignKey: 'articleId',
      sourceKey: 'id',
    });

    /**
     * user association
     */
    Article.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }
}

module.exports = (sequelize: Sequelize) => {
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
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      liked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
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
