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
        // non-authenticated user also can rate video
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
