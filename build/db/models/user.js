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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var provider_1 = __importDefault(require("../../interfaces/provider"));
var role_1 = __importDefault(require("../../interfaces/role"));
module.exports = function (sequelize) {
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.provider = provider_1.default.LOCAL;
            _this.role = role_1.default.VIEWER_CLIENT;
            return _this;
        }
        User.associate = function (models) {
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
        };
        return User;
    }(sequelize_1.Model));
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                min: 3,
                max: 10,
            },
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 6,
            },
        },
        provider: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: provider_1.default.LOCAL,
            validate: {
                isIn: [[provider_1.default.LOCAL, provider_1.default.FACEBOOK, provider_1.default.GOOGLE]],
            },
        },
        isLoggedIn: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        image: sequelize_1.DataTypes.STRING,
        allowEmailNotification: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        role: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: role_1.default.VIEWER_CLIENT,
            allowNull: false,
            validate: {
                isIn: [
                    [
                        role_1.default.VIEWER_CLIENT,
                        role_1.default.VIDEO_CLIENT,
                        role_1.default.ADS_CLIENT,
                        role_1.default.ADMIN,
                        role_1.default.SUPER_ADMIN,
                    ],
                ],
            },
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'user',
        modelName: 'User',
    });
    return User;
};
