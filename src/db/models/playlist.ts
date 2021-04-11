import { Model, Sequelize, DataTypes } from 'sequelize';
import { IPlaylist, IModel } from '../../interfaces/model';

export default class Playlist extends Model<IPlaylist> implements IPlaylist {
  readonly id!: number;
  slug!: string;
  title!: string;
  userId!: number;
  videoId!: number;

  static associate(models: IModel) {
    /**
     * user association
     */
    Playlist.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });

    /**
     * video association
     */
    Playlist.belongsTo(models.Video, {
      foreignKey: 'videoId',
      targetKey: 'id',
    });
  }
}
module.exports = (sequelize: Sequelize) => {
  Playlist.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          max: 50,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'playlist',
      modelName: 'Playlist',
    },
  );
  return Playlist;
};
