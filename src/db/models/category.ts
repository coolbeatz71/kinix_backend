'use strict';
import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUnknownObject } from '../../interfaces/UnknownObject';

interface ICategory {
  readonly id: number;
  userId: number;
  articleId: number;
}

module.exports = (sequelize: Sequelize) => {
  class Category extends Model<ICategory> implements ICategory {
    readonly id!: number;
    userId!: number;
    articleId!: number;

    static associate(models: IUnknownObject) {
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
      tableName: 'category',
      modelName: 'Category',
    },
  );
  return Category;
};
