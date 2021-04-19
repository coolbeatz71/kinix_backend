import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('article', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    slug: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    body: {
      type: DataTypes.TEXT,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    video: {
      type: DataTypes.STRING,
    },
    reads: {
      type: DataTypes.INTEGER,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('article');
};
