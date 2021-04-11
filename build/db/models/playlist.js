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
    var Playlist = /** @class */ (function (_super) {
        __extends(Playlist, _super);
        function Playlist() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Playlist.associate = function (models) {
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
        };
        return Playlist;
    }(sequelize_1.Model));
    Playlist.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 50,
            },
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        videoId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'playlist',
        modelName: 'Playlist',
    });
    return Playlist;
};
