/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, OK, UNAUTHORIZED } from 'http-status';
import { validationResult } from 'express-validator';
import {
  comparePassword,
  getHashedPassword,
  getResponse,
  getServerError,
  getValidationError,
} from '../../helpers/api';
import AuthValidator from '../../validator/auth';
import { generateToken } from '../../helpers/jwt';
import { IUser } from '../../interfaces/model';
import db from '../../db/models';
import {
  ACCOUNT_CREATED_SUCCESS,
  ACCOUNT_EXIST,
  CHECK_CONFIRM_EMAIL,
  PASSWORD_INVALID,
  SIGNOUT_SUCCESS,
  USERNAME_EMAIL_INVALID,
  USERNAME_TAKEN,
  USER_LOGIN_SUCCESS,
} from '../../constants/message';
import { IJwtPayload } from '../../interfaces/api';
import ERole from '../../interfaces/role';

export class Auth {
  /**
   * controller to sign up the user
   * @param req Request
   * @param res Response
   */
  signup = async (req: Request, res: Response): Promise<any> => {
    const { userName, email, password } = req.body;

    await new AuthValidator(req).signup();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const isUserNameExist = await db.User.findOne({
        where: {
          userName,
        },
      });

      const isEmailExist = await db.User.findOne({
        where: {
          email,
        },
      });

      if (isUserNameExist) {
        return getResponse(res, CONFLICT, {
          message: USERNAME_TAKEN,
        });
      }

      if (isEmailExist) {
        return getResponse(res, CONFLICT, {
          message: ACCOUNT_EXIST,
        });
      }

      const hashPassword = getHashedPassword(password);

      const newUser = await db.User.create({
        userName,
        email,
        password: hashPassword,
      });

      const token = generateToken(newUser.get());

      // TODO: should send email here for email confirmation

      return this.userResponse(res, newUser.get(), token, CREATED, ACCOUNT_CREATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to login the user
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
          [Op.or]: [{ userName: credential }, { email: credential }],
        },
      });

      if (!user) {
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

      // handle non verified account
      if (user.get().verified === false) {
        // TODO should resend email confirmation here
        return getResponse(res, BAD_REQUEST, {
          message: CHECK_CONFIRM_EMAIL,
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
      return this.userResponse(res, update[1][0], token, OK, USER_LOGIN_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * helper to send user info after authentication
   * @param res Response
   * @param user Object
   * @param token string
   * @param status number
   * @param message string
   * @returns
   */
  userResponse = (res: Response, user: IUser, token: string, status: number, message: string) => {
    return getResponse(res, status, {
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
  };

  /**
   * The controller for signing out
   * @param {req} req the request
   * @param {res} res the response
   * @return {void}
   */
  signout = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.user as IJwtPayload;
      await db.User.update({ isLoggedIn: false }, { where: { id } });

      return getResponse(res, OK, {
        message: SIGNOUT_SUCCESS,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const authCtrl = new Auth();
export default authCtrl;
