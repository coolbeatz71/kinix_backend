'use strict';
const CategoryData = require('./data/category').default;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkInsert('category', CategoryData, {});
  },
  down: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkDelete('category', null, {});
  },
};
