import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IResponseBody } from '../api/interfaces/response';

/**
 * return the API http response
 * @param res
 * @param body
 * @return Response
 */
export const getResponse = (res: Response, status: number, body: IResponseBody): Response =>
  res.status(status).json(body);

/**
 * display the validation errors
 * @param res Response
 */
export const getValidationError = (res: Response, errors: any): Response | any =>
  getResponse(res, httpStatus.BAD_REQUEST, {
    message: errors.array(),
  });
