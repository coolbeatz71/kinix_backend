import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.addColumn('user', 'countryName', {
      type: DataTypes.STRING,
    }),
    queryInterface.addColumn('user', 'countryFlag', {
      type: DataTypes.STRING,
    }),
    queryInterface.addColumn('user', 'phoneISOCode', {
      type: DataTypes.STRING,
    }),
    queryInterface.addColumn('user', 'phoneDialCode', {
      type: DataTypes.STRING,
    }),
    queryInterface.addColumn('user', 'phonePartial', {
      type: DataTypes.STRING,
    }),
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  return Promise.all([
    queryInterface.removeColumn('user', 'countryName'),
    queryInterface.removeColumn('user', 'countryFlag'),
    queryInterface.removeColumn('user', 'phoneISOCode'),
    queryInterface.removeColumn('user', 'phoneDialCode'),
    queryInterface.removeColumn('user', 'phonePartial'),
  ]);
};
