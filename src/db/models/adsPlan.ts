import { Model, Sequelize, DataTypes } from 'sequelize';
import EPromotionPlan from '../../interfaces/promotionPlan';
import { IAdsPlan, IModel } from '../../interfaces/model';

export default class AdsPlan extends Model<IAdsPlan> implements IAdsPlan {
  readonly id!: number;
  name!: EPromotionPlan;
  price!: number;
  duration!: number;

  static associate(models: IModel) {
    /**
     * ads association
     */
    AdsPlan.hasMany(models.Ads, {
      as: 'ads',
      foreignKey: 'planId',
      sourceKey: 'id',
    });
  }
}

export const initAdsPlan = (sequelize: Sequelize) => {
  AdsPlan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: EPromotionPlan.BASIC,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'ads-plan',
      modelName: 'AdsPlan',
    },
  );
  return AdsPlan;
};
