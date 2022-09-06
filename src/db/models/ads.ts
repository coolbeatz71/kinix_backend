import { Model, Sequelize, DataTypes } from 'sequelize';
import { IAds, IModel } from '../../interfaces/model';

export default class Ads extends Model<IAds> implements IAds {
  readonly id?: number;
  userId!: number | null;
  planId!: number;
  slug!: string;
  legend!: string;
  title!: string;
  subTitle!: string;
  body!: string;
  redirectUrl?: string | null;
  image!: string;
  active!: boolean;
  startDate!: string;
  endDate!: string;

  static associate(models: IModel) {
    /**
     * user association
     */
    Ads.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * ads plan association
     */
    Ads.belongsTo(models.AdsPlan, {
      as: 'ads-plan',
      foreignKey: 'planId',
      targetKey: 'id',
    });
  }
}

export const initAds = (sequelize: Sequelize) => {
  Ads.init(
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
      redirectUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      planId: {
        type: DataTypes.INTEGER,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: 'ads',
      modelName: 'Ads',
    },
  );
  return Ads;
};
