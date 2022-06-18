import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('promotion', {
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
    url: {
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
    categoryId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    till: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
  await queryInterface.dropTable('promotion');
};
