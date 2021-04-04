'use strict';
const { Model } = require('sequelize');
const { EProvider } = require('../interfaces/provider');
const { EROLE } = require('../interfaces/role');

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      /**
       * user role association
       */
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        targetKey: 'id',
      });

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
    }
  }

  User.init(
    {
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
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: EROLE.VIEWER_CLIENT,
        allowNull: false,
        validate: {
          isIn: [
            [
              EROLE.VIEWER_CLIENT,
              EROLE.VIDEO_CLIENT,
              EROLE.ADS_CLIENT,
              EROLE.ADMIN,
              EROLE.SUPER_ADMIN,
            ],
          ],
        },
      },
    },
    {
      sequelize,
      tableName: 'user',
      modelName: 'User',
    },
  );
  return User;
};
