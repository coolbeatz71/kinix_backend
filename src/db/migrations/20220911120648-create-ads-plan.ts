import { QueryInterface, DataTypes } from 'sequelize';
import EPromotionPlan from '../../interfaces/promotion';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('ads-plan', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: EPromotionPlan.BASIC,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // number of days
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  await queryInterface.dropTable('ads-plan');
};
