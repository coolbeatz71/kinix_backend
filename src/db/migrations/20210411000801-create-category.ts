import { QueryInterface, DataTypes } from 'sequelize';
import ECategory from '../../interfaces/category';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('category', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: ECategory.MUSIC_VIDEO,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('category');
};
