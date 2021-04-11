"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs_1 = __importDefault(require("dayjs"));
var faker_1 = require("faker");
var title1 = 'How to Doggie';
var title2 = 'Just a sample title';
// generate createdDate and updateDate
var createdAt = dayjs_1.default().format();
var updatedAt = createdAt;
var ArticleData = [
    {
        slug: faker_1.helpers.slugify(title1),
        title: title1,
        summary: faker_1.lorem.words(300),
        body: faker_1.lorem.words(1000),
        images: ['https://dougie.jpg'],
        video: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
        tags: [faker_1.lorem.words(1), faker_1.lorem.words(1), faker_1.lorem.words(1)],
        liked: false,
        likeCount: 0,
        userId: 4,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        slug: faker_1.helpers.slugify(title2),
        title: title2,
        summary: faker_1.lorem.words(200),
        body: faker_1.lorem.words(1250),
        images: ['https://dougie.jpg'],
        video: 'https://www.youtube.com/watch?v=t7PmzdINGZk',
        tags: [faker_1.lorem.words(1), faker_1.lorem.words(1), faker_1.lorem.words(1)],
        liked: true,
        likeCount: 10,
        userId: 5,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
];
exports.default = ArticleData;
