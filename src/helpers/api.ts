import bcrypt from 'bcrypt';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import slugify from '@sindresorhus/slugify';
import { config } from 'dotenv';
import { IResponseBody } from '../interfaces/api';
import { IVideo, IArticle, IComment, IRate, ILike, IUser } from '../interfaces/model';
import { IUnknownObject } from '../interfaces/unknownObject';
import { RESOURCE_NOT_FOUND } from '../constants/message';
import Video from '../db/models/video';
import Article from '../db/models/article';
import IOverview from '../interfaces/overview';

config();

export const generateSlug = async (title: string) =>
  `${await slugify(title, { lowercase: true })}-${
    Math.floor(Math.random() * 999999999) + 100000000
  }`;

/**
 * check if the request body contains a given field
 *
 * @param req
 * @param field
 * @return boolean
 */
export const isFieldInBody = (req: Request, field: string) =>
  Object.prototype.hasOwnProperty.call(req.body, field);

/**
 * get pagination utils for dashboard tables
 *
 * @param page number
 * @param size number
 * @returns IUnknownObject
 */
export const getPagination = (page: number, size: number): IUnknownObject => {
  const limit = size;
  const offset = page * limit;

  return { limit, offset };
};

/**
 * get paging data for dashboard tables
 *
 * @param page number
 * @param limit number
 * @param data Object
 * @returns IUnknownObject
 */
export const getPagingData = (
  page: number,
  limit: number,
  data: {
    rows: Video[] | Article[];
    count: number;
  },
): IUnknownObject => {
  const { count: total, rows } = data;
  const currentPage = Number(page);
  const pages = Math.ceil(total / limit);

  return { total, rows, pages, currentPage };
};

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
 * return the content response to the user
 *
 * @param res
 * @param data article|video
 * @param status
 * @param message
 * @returns Response
 */
export const contentResponse = (
  res: Response,
  data: IVideo | IArticle | IComment | IRate | ILike | IOverview,
  status: number,
  message?: string,
) =>
  getResponse(res, status, {
    message,
    data,
  });

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
export const notFoundError = (_req: Request, res: Response, _next: NextFunction) =>
  res.status(NOT_FOUND).json({
    message: RESOURCE_NOT_FOUND,
  });

/**
 * return internal server error
 * @param res
 * @param error
 * @returns
 */
export const getServerError = (res: Response, error: any) =>
  getResponse(res, INTERNAL_SERVER_ERROR, {
    message: error,
  });

/**
 * generate a hashed password
 * @param password
 * @returns string
 */
export const getHashedPassword = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8));

/**
 * compare passwords
 * @param password
 * @returns string
 */
export const comparePassword = (password: string, hashedPassword: string) =>
  bcrypt.compareSync(password, hashedPassword);

/**
 * helper to send user info after authentication
 * @param res Response
 * @param user Object
 * @param token string
 * @param status number
 * @param message string
 * @returns
 */
export const getUserResponse = (
  res: Response,
  user: IUser,
  token: string,
  status: number,
  message: string,
) =>
  getResponse(res, status, {
    token,
    message,
    data: {
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      image: user.image,
      allowEmailNotification: user.allowEmailNotification,
      role: user.role,
      verified: user.verified,
      isLoggedIn: user.isLoggedIn,
      provider: user.provider,
    },
  });
