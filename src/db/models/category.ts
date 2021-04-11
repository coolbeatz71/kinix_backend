import { Model, Sequelize, DataTypes } from 'sequelize';
import ECategory from '../../interfaces/category';
import { ICategory, IModel } from '../../interfaces/model';

module.exports = (sequelize: Sequelize) => {
  class Category extends Model<ICategory> implements ICategory {
    readonly id!: number;
    name!: string;

    static associate(models: IModel) {
      /**
       * video association
       */
      Category.belongsTo(models.Video, {
        foreignKey: 'categoryId',
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
      name: {
        type: DataTypes.STRING,
        defaultValue: ECategory.MUSIC_VIDEO,
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
