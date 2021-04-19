import { Model, Sequelize, DataTypes } from 'sequelize';
import { IBookmark } from '../../interfaces/model';
import { IUnknownObject } from '../../interfaces/unknownObject';

export default class Bookmark extends Model<IBookmark> implements IBookmark {
  readonly id!: number;
  userId!: number;
  articleId!: number;

  static associate(models: IUnknownObject) {
    /**
     * user association
     */
    Bookmark.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * article association
     */
    Bookmark.belongsTo(models.Article, {
      as: 'article',
      foreignKey: 'articleId',
      targetKey: 'id',
    });
  }
}

export const initBookmark = (sequelize: Sequelize) => {
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
