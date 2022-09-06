import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('story', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    legend: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    redirectUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('story');
};
