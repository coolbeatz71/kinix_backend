import { Model, Sequelize, DataTypes } from 'sequelize';
import { IModel, IVideo } from '../../interfaces/model';

module.exports = (sequelize: Sequelize) => {
  class Video extends Model<IVideo> implements IVideo {
    readonly id!: number;
    link!: string;
    title!: string;
    tags!: string[] | null;
    shared = false;
    shareCount = 0;
    userId!: number;
    categoryId!: number;

    static associate(models: IModel) {
      /**
       * user association
       */
      Video.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      /**
       * category association
       */
      Video.hasOne(models.Category, {
        foreignKey: 'categoryId',
        sourceKey: 'id',
      });

      /**
       * rate association
       */
      Video.hasMany(models.Rate, {
        foreignKey: 'videoId',
        sourceKey: 'id',
      });

      /**
       * share association
       */
      Video.hasMany(models.Share, {
        foreignKey: 'videoId',
        sourceKey: 'id',
      });

      /**
       * playlist association
       */
      Video.hasMany(models.Playlist, {
        foreignKey: 'videoId',
        sourceKey: 'id',
      });
    }
  }

  Video.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      shared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
