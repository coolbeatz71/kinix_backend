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
    var Article = /** @class */ (function (_super) {
        __extends(Article, _super);
        function Article() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Article.associate = function (models) {
            /**
             * bookmark association
             */
            Article.hasMany(models.Bookmark, {
                foreignKey: 'articleId',
                sourceKey: 'id',
            });
            /**
             * like association
             */
            Article.hasMany(models.Like, {
                foreignKey: 'articleId',
                sourceKey: 'id',
            });
            /**
             * user association
             */
            Article.belongsTo(models.User, {
                foreignKey: 'userId',
                targetKey: 'id',
            });
        };
        return Article;
    }(sequelize_1.Model));
    Article.init({
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
                max: 100,
            },
        },
        summary: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            validate: {
                min: 100,
                max: 300,
            },
        },
        body: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        images: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
        video: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
        reads: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
        liked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        likeCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'article',
        modelName: 'Article',
    });
    return Article;
};
