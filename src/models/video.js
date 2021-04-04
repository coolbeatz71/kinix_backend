'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      /**
       * user association
       */
      Video.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      /**
       * category association
       */
      Video.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        targetKey: 'id',
      });

      /**
       * rate association
       */
      Video.hasMany(models.Rate, {
        foreignKey: 'videoId',
        sourceKey: 'id',
      });

      /**
       * share association
       */
      Video.hasMany(models.Share, {
        foreignKey: 'videoId',
        sourceKey: 'id',
      });

      /**
       * playlist association
       */
      Video.hasMany(models.Playlist, {
        foreignKey: 'videoId',
        sourceKey: 'id',
      });
    }
  }

  Video.init(
    {
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 100,
        },
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      shared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'video',
      modelName: 'Video',
    },
  );
  return Video;
};
