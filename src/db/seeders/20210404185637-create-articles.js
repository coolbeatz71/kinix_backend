'use strict';
const ArticleData = require('./data/article').default;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkInsert('article', ArticleData, {});
  },
  down: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkDelete('article', null, {});
  },
};
