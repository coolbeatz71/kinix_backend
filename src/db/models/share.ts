'use strict';
import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUnknownObject } from '../../interfaces/UnknownObject';

interface IShare {
  readonly id: number;
  userId: number | null;
  videoId: number;
}

module.exports = (sequelize: Sequelize) => {
  class Share extends Model<IShare> implements IShare {
    readonly id!: number;
    userId!: number | null;
    videoId!: number;

    static associate(models: IUnknownObject) {
      /**
       * video association
       */
      Share.belongsTo(models.Video, {
        foreignKey: 'videoId',
        targetKey: 'id',
      });
    }
  }

  Share.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'share',
      modelName: 'Share',
    },
  );
  return Share;
};
