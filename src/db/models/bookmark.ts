import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUnknownObject } from '../../interfaces/UnknownObject';

interface IBookmark {
  readonly id: number;
  userId: number;
  articleId: number;
}

module.exports = (sequelize: Sequelize) => {
  class Bookmark extends Model<IBookmark> implements IBookmark {
    readonly id!: number;
    userId!: number;
    articleId!: number;

    static associate(models: IUnknownObject) {
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
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
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
      timestamps: true,
      tableName: 'bookmark',
      modelName: 'Bookmark',
    },
  );

  return Bookmark;
};
