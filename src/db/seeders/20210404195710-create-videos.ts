import { QueryInterface } from 'sequelize';
import VideoData from './data/video';

export const up = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkInsert('video', VideoData, {});
};

export const down = async (queryInterface: QueryInterface) => {
  return queryInterface.bulkDelete('video', {}, {});
};
