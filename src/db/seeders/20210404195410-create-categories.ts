import { QueryInterface } from 'sequelize';
import CategoryData from './data/category';

export const up = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkInsert('category', CategoryData, {});
};

export const down = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkDelete('category', {}, {});
};
