'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      /**
       * user association
       */
      Playlist.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      /**
       * video association
       */
      Playlist.belongsTo(models.Video, {
        foreignKey: 'videoId',
        targetKey: 'id',
      });
    }
  }

  Playlist.init(
    {
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 50,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'playlist',
      modelName: 'Playlist',
    },
  );
  return Playlist;
};
