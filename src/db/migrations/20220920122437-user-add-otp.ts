import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn('user', 'otp', {
      type: DataTypes.STRING,
    }),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([queryInterface.removeColumn('user', 'otp')]);
};
