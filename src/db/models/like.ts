import { Model, Sequelize, DataTypes } from 'sequelize';
import { ILike, IModel } from '../../interfaces/model';

module.exports = (sequelize: Sequelize) => {
  class Like extends Model<ILike> implements ILike {
    readonly id!: number;
    userId!: number;
    articleId!: number;

    static associate(models: IModel) {
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
      tableName: 'like',
      modelName: 'Like',
    },
  );
  return Like;
};
