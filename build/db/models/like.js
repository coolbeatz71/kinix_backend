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
    var Like = /** @class */ (function (_super) {
        __extends(Like, _super);
        function Like() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Like.associate = function (models) {
            /**
             * article association
             */
            Like.belongsTo(models.Article, {
                foreignKey: 'articleId',
                targetKey: 'id',
            });
            /**
             * user association
             */
            Like.belongsTo(models.User, {
                foreignKey: 'articleId',
                targetKey: 'id',
            });
        };
        return Like;
    }(sequelize_1.Model));
    Like.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        articleId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'like',
        modelName: 'Like',
    });
    return Like;
};
