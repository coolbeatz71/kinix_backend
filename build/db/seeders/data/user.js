"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var dotenv_1 = __importDefault(require("dotenv"));
var dayjs_1 = __importDefault(require("dayjs"));
var faker_1 = require("faker");
var role_1 = __importDefault(require("../../../interfaces/role"));
dotenv_1.default.config();
// generate encryoted password
var plainPwd = process.env.USER_PASSWORD;
var password = bcrypt_1.default.hashSync(plainPwd, bcrypt_1.default.genSaltSync(8));
// generate createdDate and updateDate
var createdAt = dayjs_1.default().format();
var updatedAt = createdAt;
var UserData = [
    {
        userName: faker_1.name.firstName(),
        email: faker_1.internet.email(),
        phoneNumber: faker_1.phone.phoneNumber(),
        password: password,
        image: faker_1.image.avatar(),
        role: role_1.default.VIDEO_CLIENT,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        userName: faker_1.name.firstName(),
        email: faker_1.internet.email(),
        phoneNumber: faker_1.phone.phoneNumber(),
        password: password,
        image: faker_1.image.avatar(),
        role: role_1.default.VIEWER_CLIENT,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        userName: faker_1.name.firstName(),
        email: faker_1.internet.email(),
        phoneNumber: faker_1.phone.phoneNumber(),
        password: password,
        image: faker_1.image.avatar(),
        role: role_1.default.ADS_CLIENT,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        userName: faker_1.name.firstName(),
        email: faker_1.internet.email(),
        phoneNumber: faker_1.phone.phoneNumber(),
        password: password,
        image: faker_1.image.avatar(),
        role: role_1.default.ADMIN,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    {
        userName: faker_1.name.firstName(),
        email: faker_1.internet.email(),
        phoneNumber: faker_1.phone.phoneNumber(),
        password: password,
        image: faker_1.image.avatar(),
        role: role_1.default.SUPER_ADMIN,
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
];
exports.default = UserData;
