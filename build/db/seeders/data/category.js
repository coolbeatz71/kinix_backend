"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs_1 = __importDefault(require("dayjs"));
var category_1 = __importDefault(require("../../../interfaces/category"));
// generate createdDate and updateDate
var createdAt = dayjs_1.default().format();
var updatedAt = createdAt;
var CategoryData = [
    {
        name: category_1.default.MUSIC_VIDEO,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        name: category_1.default.PODCAST,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        name: category_1.default.LEFOCUS,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        name: category_1.default.INTERVIEW,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        name: category_1.default.FLEXBEATZ,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
];
exports.default = CategoryData;
