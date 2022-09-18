import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn('article', 'featured', {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    }),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([queryInterface.removeColumn('article', 'featured')]);
};
