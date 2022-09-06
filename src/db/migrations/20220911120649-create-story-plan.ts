import { QueryInterface, DataTypes } from 'sequelize';
import EPromotionPlan from '../../interfaces/promotionPlan';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('story-plan', {
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
  await queryInterface.dropTable('story-plan');
};
