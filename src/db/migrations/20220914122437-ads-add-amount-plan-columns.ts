import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn('ads', 'amount', {
      type: DataTypes.FLOAT,
    }),
    queryInterface.addColumn('ads', 'plan', {
      type: DataTypes.STRING,
    }),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.removeColumn('ads', 'amount'),
    queryInterface.removeColumn('ads', 'plan'),
  ]);
};
