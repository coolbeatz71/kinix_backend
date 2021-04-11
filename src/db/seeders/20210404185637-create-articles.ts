import { QueryInterface } from 'sequelize';
import ArticleData from './data/article';

export const up = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkInsert('article', ArticleData, {});
};

export const down = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkDelete('article', {}, {});
};
