"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs_1 = __importDefault(require("dayjs"));
var faker_1 = require("faker");
var title1 = 'Just a sample title 1';
var title2 = 'Just a sample title 2';
// generate createdDate and updateDate
var createdAt = dayjs_1.default().format();
var updatedAt = createdAt;
var VideoData = [
    {
        link: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
        title: title1,
        tags: [faker_1.lorem.words(1), faker_1.lorem.words(1), faker_1.lorem.words(1)],
        shared: false,
        shareCount: 0,
        userId: 1,
        categoryId: 1,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        link: 'https://www.youtube.com/watch?v=ojJupoAyT58',
        title: title2,
        tags: [faker_1.lorem.words(1), faker_1.lorem.words(1), faker_1.lorem.words(1)],
        shared: false,
        shareCount: 0,
        userId: 1,
        categoryId: 2,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
];
exports.default = VideoData;
