import { Model, Sequelize, DataTypes } from 'sequelize';
import { IModel, IVideo } from '../../interfaces/model';

export default class Video extends Model<IVideo> implements IVideo {
  readonly id!: number;
  slug!: string;
  link!: string;
  title!: string;
  tags!: string[] | null;
  active!: boolean;
  shared!: boolean;
  userId!: number;
  categoryId!: number;

  static associate(models: IModel) {
    /**
     * user association
     */
    Video.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * category association
     */
    Video.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId',
      targetKey: 'id',
    });

    /**
     * rate association
     */
    Video.hasMany(models.Rate, {
      as: 'rate',
      foreignKey: 'videoId',
      sourceKey: 'id',
    });

    /**
     * share association
     */
    Video.hasMany(models.Share, {
      as: 'share',
      foreignKey: 'videoId',
      sourceKey: 'id',
    });

    /**
     * playlist association
     */
    Video.hasMany(models.Playlist, {
      as: 'playlist',
      foreignKey: 'videoId',
      sourceKey: 'id',
    });
  }
}

export const initVideo = (sequelize: Sequelize) => {
  Video.init(
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
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 100,
        },
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      shared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'video',
      modelName: 'Video',
    },
  );
  return Video;
};
