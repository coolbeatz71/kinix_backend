"use strict";
/* tslint:disable no-var-requires */
/* tslint:disable prefer-template */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Sequelize = require('sequelize');
var basename = path_1.default.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + "/../config/config.js")[env];
var db = {};
var sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config);
fs_1.default.readdirSync(__dirname)
    .filter(function (file) {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
})
    .forEach(function (file) {
    var model = require(path_1.default.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate)
        db[modelName].associate(db);
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
exports.default = db;
