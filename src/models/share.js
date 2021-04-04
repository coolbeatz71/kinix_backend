'use strict';
const { Model } = require('sequelize');

export default (sequelize, DataTypes) => {
  class Share extends Model {
    static associate(models) {
      /**
       * video association
       */
      Share.belongsTo(models.Video, {
        foreignKey: 'videoId',
        targetKey: 'id',
      });
    }
  }

  Share.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'share',
      modelName: 'Share',
    },
  );
  return Share;
};
