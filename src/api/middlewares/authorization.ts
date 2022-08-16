/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from 'dotenv';
import { getResponse } from '../../helpers/api';
import db from '../../db/models';
import {
  ADMIN_FORBIDDEN,
  AUTHORIZATION_MISSING,
  LOGIN_REQUIRED,
  SUPER_ADMIN_FORBIDDEN,
  TOKEN_INVALID_EXPIRED,
  USER_FORBIDDEN,
} from '../../constants/message';
import ERole from '../../interfaces/role';
import { IJwtPayload } from '../../interfaces/api';

config();

/**
 * function to verify the token from the header
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns boolean
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { authorization } = req.headers;
  if (!authorization) {
    return getResponse(res, httpStatus.UNAUTHORIZED, {
      message: AUTHORIZATION_MISSING,
    });
  }

  const token: string = authorization.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    const jwtPayload: any = jwt.verify(token, secret);

    const user = await db.User.findOne({
      where: { id: jwtPayload.id, email: jwtPayload.email },
    });

    if (!user) {
      return getResponse(res, httpStatus.UNAUTHORIZED, {
        message: TOKEN_INVALID_EXPIRED,
      });
    }

    if (user.get().isLoggedIn === false) {
      return getResponse(res, httpStatus.FORBIDDEN, {
        message: LOGIN_REQUIRED,
      });
    }

    req.user = jwtPayload;
    next();
  } catch (error) {
    const message = TOKEN_INVALID_EXPIRED;
    return getResponse(res, httpStatus.UNAUTHORIZED, { message });
  }
};

/**
 * Middleware to verify super-admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
export const superAdminCheck = (req: Request, res: Response, next: NextFunction): void => {
  verifyToken(req, res, () => {
    const { role }: IJwtPayload = req.user as IJwtPayload;

    if (role === ERole.SUPER_ADMIN) return next();
    return getResponse(res, httpStatus.FORBIDDEN, {
      message: SUPER_ADMIN_FORBIDDEN,
    });
  });
};

/**
 * Middleware to verify admin OR super-admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
export const adminsCheck = (req: Request, res: Response, next: NextFunction): void => {
  verifyToken(req, res, () => {
    const { role }: IJwtPayload = req.user as IJwtPayload;

    if ([ERole.ADMIN, ERole.SUPER_ADMIN].includes(role)) return next();
    return getResponse(res, httpStatus.FORBIDDEN, {
      message: ADMIN_FORBIDDEN,
    });
  });
};

/**
 * Middleware to verify user access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
export const userCheck = (req: Request, res: Response, next: NextFunction): void => {
  verifyToken(req, res, () => {
    const { role }: IJwtPayload = req.user as IJwtPayload;

    if ([ERole.VIEWER_CLIENT, ERole.VIDEO_CLIENT, ERole.ADS_CLIENT].includes(role)) return next();
    return getResponse(res, httpStatus.FORBIDDEN, {
      message: USER_FORBIDDEN,
    });
  });
};
