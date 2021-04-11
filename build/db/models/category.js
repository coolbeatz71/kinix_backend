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
var category_1 = __importDefault(require("../../interfaces/category"));
module.exports = function (sequelize) {
    var Category = /** @class */ (function (_super) {
        __extends(Category, _super);
        function Category() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Category.associate = function (models) {
            /**
             * video association
             */
            Category.belongsTo(models.Video, {
                foreignKey: 'categoryId',
                targetKey: 'id',
            });
        };
        return Category;
    }(sequelize_1.Model));
    Category.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: category_1.default.MUSIC_VIDEO,
        },
    }, {
        sequelize: sequelize,
        timestamps: true,
        tableName: 'category',
        modelName: 'Category',
    });
    return Category;
};
