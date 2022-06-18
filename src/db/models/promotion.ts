import { Model, Sequelize, DataTypes } from 'sequelize';
import { IPromotion, IModel } from '../../interfaces/model';

export default class Promotion extends Model<IPromotion> implements IPromotion {
  readonly id?: number;
  userId!: number | null;
  categoryId!: number;
  promotionPlanId!: number;
  slug!: string;
  legend!: string;
  title!: string;
  subTitle!: string;
  body!: string;
  url?: string | null;
  media!: string;
  mediaType!: string;
  active!: boolean;

  static associate(models: IModel) {
    /**
     * user association
     */
    Promotion.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * category association
     */
    Promotion.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId',
      targetKey: 'id',
    });

    /**
     * promotion plan association
     */
    Promotion.belongsTo(models.PromotionPlan, {
      as: 'promotionPlan',
      foreignKey: 'promotionPlanId',
      targetKey: 'id',
    });
  }
}

export const initPromotion = (sequelize: Sequelize) => {
  Promotion.init(
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
      promotionPlanId: {
        type: DataTypes.INTEGER,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'promotion',
      modelName: 'Promotion',
    },
  );
  return Promotion;
};
