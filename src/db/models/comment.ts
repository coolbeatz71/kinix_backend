import { Model, Sequelize, DataTypes } from 'sequelize';
import { IComment } from '../../interfaces/model';
import { IUnknownObject } from '../../interfaces/unknownObject';

export default class Comment extends Model<IComment> implements IComment {
  readonly id!: number;
  userId!: number;
  body!: string;
  articleId!: number;

  static associate(models: IUnknownObject) {
    /**
     * user association
     */
    Comment.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * article association
     */
    Comment.belongsTo(models.Article, {
      as: 'article',
      foreignKey: 'articleId',
      targetKey: 'id',
    });
  }
}

export const initComment = (sequelize: Sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: 'comment',
      modelName: 'Comment',
    },
  );

  return Comment;
};
