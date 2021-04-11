import { Model, Sequelize, DataTypes } from 'sequelize';
import { IUser, IModel } from '../../interfaces/model';
import EProvider from '../../interfaces/provider';
import ERole from '../../interfaces/role';

export default class User extends Model<IUser> implements IUser {
  readonly id!: number;
  userName!: string;
  password!: string;
  email?: string | null;
  phoneNumber?: string | null;
  provider?: EProvider = EProvider.LOCAL;
  isLoggedIn?: boolean;
  verified?: boolean;
  image?: string | null;
  allowEmailNotification?: boolean;
  role?: ERole = ERole.VIEWER_CLIENT;

  static associate(models: IModel) {
    /**
     * video association
     */
    User.hasMany(models.Video, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });

    /**
     * video-playlist association
     */
    User.hasMany(models.Playlist, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });

    /**
     * article-bookmark association
     */
    User.hasMany(models.Bookmark, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });

    /**
     * article-like association
     */
    User.hasMany(models.Like, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });

    /**
     * article association
     */
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
  }
}

module.exports = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          min: 3,
          max: 10,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 6,
        },
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: EProvider.LOCAL,
        validate: {
          isIn: [[EProvider.LOCAL, EProvider.FACEBOOK, EProvider.GOOGLE]],
        },
      },
      isLoggedIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      image: DataTypes.STRING,
      allowEmailNotification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: ERole.VIEWER_CLIENT,
        allowNull: false,
        validate: {
          isIn: [
            [
              ERole.VIEWER_CLIENT,
              ERole.VIDEO_CLIENT,
              ERole.ADS_CLIENT,
              ERole.ADMIN,
              ERole.SUPER_ADMIN,
            ],
          ],
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'user',
      modelName: 'User',
    },
  );
  return User;
};
