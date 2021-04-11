"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.development = exports.production = exports.test = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.config();
var getOptions = function (env, options) {
    return __assign({ username: process.env.PGUSER, password: process.env.PGPASSWORD, database: process.env["PGDATABASE_" + env], host: process.env.PGHOST, dialect: 'postgres', logging: env === 'TEST' }, options);
};
exports.test = getOptions('TEST');
exports.production = getOptions('PROD');
exports.development = getOptions('DEV');
