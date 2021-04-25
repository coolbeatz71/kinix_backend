import { Model, Sequelize, DataTypes } from 'sequelize';
import { IRate, IModel } from '../../interfaces/model';

export default class Rate extends Model<IRate> implements IRate {
  readonly id!: number;
  userId!: number | null;
  videoId!: number;
  count!: number;

  static associate(models: IModel) {
    /**
     * video association
     */
    Rate.belongsTo(models.Video, {
      as: 'video',
      foreignKey: 'videoId',
      targetKey: 'id',
    });
  }
}

export const initRate = (sequelize: Sequelize) => {
  Rate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
