/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { FORBIDDEN, OK, UNAUTHORIZED } from 'http-status';
import {
  getResponse,
  getServerError,
  getUserResponse,
  comparePassword,
  getValidationError,
} from '../../../helpers/api';
import db from '../../../db/models';
import AuthValidator from '../../../validator/auth';
import { generateToken } from '../../../helpers/jwt';
import {
  USER_BLOCKED,
  PASSWORD_INVALID,
  USER_LOGIN_SUCCESS,
  USERNAME_EMAIL_INVALID,
} from '../../../constants/message';
import ERole from '../../../interfaces/role';

export class AdminAuth {
  /**
   * controller to login the admin
   * @param req Request
   * @param res Response
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    const { credential, password } = req.body;

    await new AuthValidator(req).login();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await db.User.findOne({
        where: {
          email: credential,
        },
      });

      if (!user || ![ERole.ADMIN, ERole.SUPER_ADMIN].includes(user?.role as ERole)) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      if (!user?.get().password) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, user?.get().password as string);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      if (user?.get().active === false) {
        return getResponse(res, FORBIDDEN, {
          code: USER_BLOCKED,
          message: req.t('USER_BLOCKED'),
        });
      }

      const update = await db.User.update(
        { isLoggedIn: true },
        { where: { id: user.id }, returning: true },
      );

      const token = generateToken(
        user?.get(),
        user?.get().role === ERole.ADMIN || user?.get().role === ERole.SUPER_ADMIN,
      );
      return getUserResponse(
        res,
        update[1][0],
        token,
        OK,
        req.t('USER_LOGIN_SUCCESS'),
        USER_LOGIN_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminAuthCtrl = new AdminAuth();
export default adminAuthCtrl;
