import { Model, Sequelize, DataTypes } from 'sequelize';
import ECategory from '../../interfaces/category';
import { ICategory, IModel } from '../../interfaces/model';

export default class Category extends Model<ICategory> implements ICategory {
  readonly id!: number;
  name!: string;

  static associate(models: IModel) {
    /**
     * video association
     */
    Category.hasMany(models.Video, {
      as: 'video',
      foreignKey: 'categoryId',
      sourceKey: 'id',
    });
  }
}

export const initCategory = (sequelize: Sequelize) => {
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
