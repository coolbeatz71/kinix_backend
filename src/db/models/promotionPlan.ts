import { Model, Sequelize, DataTypes } from 'sequelize';
import EPromotionPlan from '../../interfaces/promotionPlan';
import { IPromotionPlan, IModel } from '../../interfaces/model';

export default class PromotionPlan extends Model<IPromotionPlan> implements IPromotionPlan {
  readonly id!: number;
  name!: EPromotionPlan;
  price!: number;
  startDate!: string;
  endDate!: string;

  static associate(models: IModel) {
    /**
     * promotion association
     */
    PromotionPlan.hasMany(models.Promotion, {
      as: 'promotion',
      foreignKey: 'promotionId',
      sourceKey: 'id',
    });
  }
}

export const initPromotionPlan = (sequelize: Sequelize) => {
  PromotionPlan.init(
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
      startDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'PromotionPlan',
      modelName: 'PromotionPlan',
    },
  );
  return PromotionPlan;
};
