import bcrypt from 'bcrypt';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import slugify from '@sindresorhus/slugify';
import { config } from 'dotenv';
import { IResponseBody } from '../interfaces/api';
import {
  IVideo,
  IArticle,
  IComment,
  IRate,
  ILike,
  IUser,
  IAdsPlan,
  IStoryPlan,
  IAds,
  IStory,
} from '../interfaces/model';
import { IUnknownObject } from '../interfaces/unknownObject';
import { RESOURCE_NOT_FOUND } from '../constants/message';
import Video from '../db/models/video';
import Article from '../db/models/article';
import IOverview from '../interfaces/overview';
import User from '../db/models/user';
import Ads from '../db/models/ads';
import Story from '../db/models/story';
import AdsPlan from '../db/models/adsPlan';
import StoryPlan from '../db/models/storyPlan';

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
export const getPagination = (page: number, size: number): { limit: number; offset: number } => {
  const limit = size;
  const offset = (page - 1) * limit;

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
    rows: Video[] | Article[] | User[] | Ads[] | Story[] | AdsPlan[] | StoryPlan[];
    count: number | any;
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
 * @param res Response
 * @param data article|video
 * @param status number
 * @param message string
 * @param code string
 * @returns Response
 */
export const contentResponse = (
  res: Response,
  data:
    | IVideo
    | IArticle
    | IComment
    | IRate
    | ILike
    | IOverview
    | IUser
    | IAdsPlan
    | IStoryPlan
    | IAds
    | IStory
    | IUnknownObject,
  status: number,
  message?: string,
  code?: string,
) =>
  getResponse(res, status, {
    data,
    code,
    message,
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
export const notFoundError = (req: Request, res: Response, _next: NextFunction) =>
  res.status(NOT_FOUND).json({
    code: RESOURCE_NOT_FOUND,
    message: req.t('RESOURCE_NOT_FOUND'),
  });

/**
 * return internal server error
 * @param res
 * @param error
 * @returns
 */
export const getServerError = (res: Response, message: string) =>
  getResponse(res, INTERNAL_SERVER_ERROR, {
    message,
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
 * @param code string
 * @returns
 */
export const getUserResponse = (
  res: Response,
  user: IUser,
  token: string,
  status: number,
  message: string,
  code: string,
) =>
  getResponse(res, status, {
    token,
    code,
    message,
    data: {
      id: user.id,
      otp: user.otp, // TODO: should be removed after email setup
      role: user.role,
      email: user.email,
      image: user.image,
      verified: user.verified,
      userName: user.userName,
      provider: user.provider,
      isLoggedIn: user.isLoggedIn,
      phoneNumber: user.phoneNumber,
      countryName: user.countryName,
      countryFlag: user.countryFlag,
      phonePartial: user.phonePartial,
      phoneISOCode: user.phoneISOCode,
      phoneDialCode: user.phoneDialCode,
      allowEmailNotification: user.allowEmailNotification,
    },
  });
