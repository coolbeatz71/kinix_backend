import { Model, Sequelize, DataTypes } from 'sequelize';
import { IStory, IModel } from '../../interfaces/model';

export default class Story extends Model<IStory> implements IStory {
  readonly id?: number;
  userId!: number | null;
  planId!: number;
  slug!: string;
  legend!: string;
  title!: string;
  subTitle!: string;
  body!: string;
  redirectUrl?: string | null;
  media!: string;
  mediaType!: string;
  active!: boolean;
  startDate!: string;
  endDate!: string;

  static associate(models: IModel) {
    /**
     * user association
     */
    Story.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * story plan association
     */
    Story.belongsTo(models.StoryPlan, {
      as: 'story_plan',
      foreignKey: 'planId',
      targetKey: 'id',
    });
  }
}

export const initStory = (sequelize: Sequelize) => {
  Story.init(
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
      media: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mediaType: {
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
      tableName: 'story',
      modelName: 'Story',
    },
  );
  return Story;
};
