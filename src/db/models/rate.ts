'use strict';
import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUnknownObject } from '../../interfaces/UnknownObject';

interface IRate {
  readonly id: number;
  userId: number | null;
  videoId: number;
  count: number;
}

module.exports = (sequelize: Sequelize) => {
  class Rate extends Model<IRate> implements IRate {
    readonly id!: number;
    userId!: number | null;
    videoId!: number;
    count!: number;

    static associate(models: IUnknownObject) {
      /**
       * video association
       */
      Rate.belongsTo(models.Video, {
        foreignKey: 'videoId',
        targetKey: 'id',
      });
    }
  }

  Rate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        // non-authenticated user also can rate video
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'rate',
      modelName: 'Rate',
    },
  );
  return Rate;
};
