'use strict';
import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUnknownObject } from '../../interfaces/UnknownObject';

interface IPlaylist {
  readonly id: number;
  slug: string;
  title: string;
  userId: number;
  videoId: number;
}

module.exports = (sequelize: Sequelize) => {
  class Playlist extends Model<IPlaylist> implements IPlaylist {
    readonly id!: number;
    slug!: string;
    title!: string;
    userId!: number;
    videoId!: number;

    static associate(models: IUnknownObject) {
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
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
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
      timestamps: true,
      tableName: 'playlist',
      modelName: 'Playlist',
    },
  );
  return Playlist;
};
