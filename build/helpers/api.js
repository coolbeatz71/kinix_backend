"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = exports.getSanitizedBody = exports.getValidationError = exports.getResponse = exports.isFieldInBody = void 0;
var http_status_1 = require("http-status");
/**
 * check if the request body contains a given field
 *
 * @param req
 * @param field
 * @return boolean
 */
var isFieldInBody = function (req, field) {
    return Object.prototype.hasOwnProperty.call(req.body, field);
};
exports.isFieldInBody = isFieldInBody;
/**
 * return the API http response
 *
 * @param res
 * @param body
 * @return Response
 */
var getResponse = function (res, status, body) {
    return res.status(status).json(body);
};
exports.getResponse = getResponse;
/**
 * display the validation errors
 *
 * @param res Response
 * @return Response
 */
var getValidationError = function (res, errors) {
    return exports.getResponse(res, http_status_1.BAD_REQUEST, {
        message: errors.array(),
    });
};
exports.getValidationError = getValidationError;
/**
 * Remove keys with undefined or falsy values from a object
 *
 * @param obj IUnknownObject
 * @return IUnknownObject
 */
var getSanitizedBody = function (obj) {
    Object.keys(obj).forEach(function (key) {
        if (!obj[key])
            delete obj[key];
    });
    return obj;
};
exports.getSanitizedBody = getSanitizedBody;
/**
 * Middleware Handle 404 Not found error
 * @param _req Request
 * @param res Response
 * @param _next NextFunction
 */
var notFoundError = function (_req, res, _next) {
    return res.status(http_status_1.NOT_FOUND).json({
        message: 'Requested Resource Not Found',
    });
};
exports.notFoundError = notFoundError;
