'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('article', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slug: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      summary: {
        type: Sequelize.TEXT,
      },
      body: {
        type: Sequelize.TEXT,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      video: {
        type: Sequelize.STRING,
      },
      reads: {
        type: Sequelize.INTEGER,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      liked: {
        type: Sequelize.BOOLEAN,
      },
      likeCount: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('article');
  },
};
