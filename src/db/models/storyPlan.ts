import { Model, Sequelize, DataTypes } from 'sequelize';
import EPromotionPlan from '../../interfaces/promotion';
import { IStoryPlan, IModel } from '../../interfaces/model';

export default class StoryPlan extends Model<IStoryPlan> implements IStoryPlan {
  readonly id!: number;
  name!: EPromotionPlan;
  price!: number;
  duration!: number;

  static associate(models: IModel) {
    /**
     * story association
     */
    StoryPlan.hasMany(models.Story, {
      as: 'story',
      foreignKey: 'planId',
      sourceKey: 'id',
    });
  }
}

export const initStoryPlan = (sequelize: Sequelize) => {
  StoryPlan.init(
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
      tableName: 'story-plan',
      modelName: 'StoryPlan',
    },
  );
  return StoryPlan;
};
