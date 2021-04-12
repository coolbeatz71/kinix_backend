import bcrypt from 'bcrypt';
import httpStatus, { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import { IResponseBody } from '../interfaces/api';
import { IUnknownObject } from '../interfaces/unknownObject';
import { RESOURCE_NOT_FOUND } from '../api/constants/message';

config();

/**
 * check if the request body contains a given field
 *
 * @param req
 * @param field
 * @return boolean
 */
export const isFieldInBody = (req: Request, field: string) => {
  return Object.prototype.hasOwnProperty.call(req.body, field);
};

/**
 * return the API http response
 *
 * @param res
 * @param body
 * @return Response
 */
export const getResponse = (res: Response, status: number, body: IResponseBody): Response => {
  return res.status(status).json(body);
};

/**
 * display the validation errors
 *
 * @param res Response
 * @return Response
 */
export const getValidationError = (res: Response, errors: any): Response | any =>
  getResponse(res, BAD_REQUEST, {
    message: errors.array(),
  });

/**
 * Remove keys with undefined or falsy values from a object
 *
 * @param obj IUnknownObject
 * @return IUnknownObject
 */
export const getSanitizedBody = (obj: IUnknownObject): IUnknownObject => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) delete obj[key];
  });
  return obj;
};

/**
 * Middleware Handle 404 Not found error
 * @param _req Request
 * @param res Response
 * @param _next NextFunction
 */
export const notFoundError = (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(NOT_FOUND).json({
    message: RESOURCE_NOT_FOUND,
  });
};

/**
 * return internal server error
 * @param res
 * @param error
 * @returns
 */
export const getServerError = (res: Response, error: any) => {
  const status = httpStatus.INTERNAL_SERVER_ERROR;
  return getResponse(res, status, {
    message: error,
  });
};

/**
 * generate a hashed password
 * @param password
 * @returns string
 */
export const getHashedPassword = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

/**
 * compare passwords
 * @param password
 * @returns string
 */
export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
