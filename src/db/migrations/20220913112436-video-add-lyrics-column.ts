import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn('video', 'lyrics', {
      type: DataTypes.TEXT,
    }),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([queryInterface.removeColumn('video', 'lyrics')]);
};
