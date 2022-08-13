import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn(
      'user', // table name
      'active', // new field name
      {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    ),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([queryInterface.removeColumn('user', 'active')]);
};
