"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
module.exports = function (sequelize) {
    var Video = /** @class */ (function (_super) {
        __extends(Video, _super);
        function Video() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shared = false;
            _this.shareCount = 0;
            return _this;
        }
        Video.associate = function (models) {
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
        };
        return Video;
    }(sequelize_1.Model));
    Video.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        link: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 100,
            },
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
        shared: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        shareCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        categoryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'video',
        modelName: 'Video',
    });
    return Video;
};
