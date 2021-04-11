"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var hpp_1 = __importDefault(require("hpp"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var api_1 = __importDefault(require("./api"));
var api_2 = require("./helpers/api");
var App = /** @class */ (function () {
    function App() {
        this.express = express_1.default();
        this.setMiddlewares();
        this.setRoutes();
        this.catchErrors();
    }
    App.prototype.setMiddlewares = function () {
        this.express.use(hpp_1.default());
        this.express.use(cors_1.default());
        this.express.use(express_1.default.json());
        this.express.use(morgan_1.default('dev'));
        this.express.use(helmet_1.default());
    };
    App.prototype.setRoutes = function () {
        this.express.use('/api/v1', api_1.default);
    };
    App.prototype.catchErrors = function () {
        this.express.use(api_2.notFoundError);
    };
    return App;
}());
var app = new App().express;
exports.default = app;
