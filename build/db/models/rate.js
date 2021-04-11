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
    var Rate = /** @class */ (function (_super) {
        __extends(Rate, _super);
        function Rate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Rate.associate = function (models) {
            /**
             * video association
             */
            Rate.belongsTo(models.Video, {
                foreignKey: 'videoId',
                targetKey: 'id',
            });
        };
        return Rate;
    }(sequelize_1.Model));
    Rate.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            // non-authenticated user also can rate video
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        videoId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        count: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'rate',
        modelName: 'Rate',
    });
    return Rate;
};
