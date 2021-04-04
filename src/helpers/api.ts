import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { IResponseBody } from '../interfaces/Api';
import { IUnknownObject } from '../interfaces/UnknownObject';

/**
 * check if the request body contains a given field
 *
 * @param req
 * @param field
 * @return boolean
 */
export const isFieldInBody = (req: Request, field: string) => req.body.hasOwnProperty(field);

/**
 * return the API http response
 *
 * @param res
 * @param body
 * @return Response
 */
export const getResponse = (res: Response, status: number, body: IResponseBody): Response =>
  res.status(status).json(body);

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
  Object.keys(obj).forEach(key => {
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
    message: 'Requested Resource Not Found',
  });
};
