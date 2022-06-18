/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { FORBIDDEN, OK, UNAUTHORIZED } from 'http-status';
import { validationResult } from 'express-validator';
import {
  comparePassword,
  getResponse,
  getServerError,
  getUserResponse,
  getValidationError,
} from '../../../helpers/api';
import AuthValidator from '../../../validator/auth';
import { generateToken } from '../../../helpers/jwt';
import db from '../../../db/models';
import {
  PASSWORD_INVALID,
  USERNAME_EMAIL_INVALID,
  USER_LOGIN_SUCCESS,
} from '../../../constants/message';
import ERole from '../../../interfaces/role';

export class AdminAuth {
  /**
   * controller to login the admin
   * @param req Request
   * @param res Response
   */
  login = async (req: Request, res: Response): Promise<any> => {
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
          message: USERNAME_EMAIL_INVALID,
        });
      }

      const isPasswordValid = comparePassword(password, user.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          message: PASSWORD_INVALID,
        });
      }

      const update = await db.User.update(
        { isLoggedIn: true },
        { where: { id: user.id }, returning: true },
      );

      const token = generateToken(
        user.get(),
        user.get().role === ERole.ADMIN || user.get().role === ERole.SUPER_ADMIN,
      );
      return getUserResponse(res, update[1][0], token, OK, USER_LOGIN_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminAuthCtrl = new AdminAuth();
export default adminAuthCtrl;
