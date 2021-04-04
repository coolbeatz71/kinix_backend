'use strict';

const UserData = require('./data/user').default;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkInsert('user', UserData, {});
  },
  down: async (queryInterface, _Sequelize) => {
    return await queryInterface.bulkDelete('user', null, {});
  },
};
