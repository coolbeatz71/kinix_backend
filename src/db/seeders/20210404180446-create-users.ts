import { QueryInterface } from 'sequelize';
import UserData from './data/user';

export const up = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkInsert('user', UserData, {});
};

export const down = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkDelete('user', {}, {});
};
