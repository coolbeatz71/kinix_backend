import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn('story', 'amount', {
      type: DataTypes.FLOAT,
    }),
    queryInterface.addColumn('story', 'plan', {
      type: DataTypes.STRING,
    }),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.removeColumn('story', 'amount'),
    queryInterface.removeColumn('story', 'plan'),
  ]);
};
