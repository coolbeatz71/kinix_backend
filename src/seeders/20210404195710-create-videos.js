'use strict';
const VideoData = require('./data/video').default;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkInsert('video', VideoData, {});
  },
  down: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkDelete('video', null, {});
  },
};
