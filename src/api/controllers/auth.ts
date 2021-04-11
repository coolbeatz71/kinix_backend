/* eslint-disable */
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, UNAUTHORIZED } from 'http-status';
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
          message: `username already taken`,
        });
      }

      if (isEmailExist) {
        return getResponse(res, CONFLICT, {
          message: `Account with that email already exists`,
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

      return this.userResponse(res, newUser.get(), token);
    } catch (error) {
      getServerError(res, error.message);
    }
  };

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
          message: 'username or email are incorrects',
        });
      }

      const isPasswordValid = comparePassword(password, user.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          message: 'password is incorrect',
        });
      }

      // handle non verified account
      if (user.get().verified === false) {
        // TODO should resend email confirmation here
        return getResponse(res, BAD_REQUEST, {
          message: 'check your email for account confirmation',
        });
      }

      await db.User.update({ isLoggedIn: true }, { where: { id: user.id } });

      const token = generateToken(user.get());
      return this.userResponse(res, user.get(), token);
    } catch (error) {
      getServerError(res, error.message);
    }
  };

  userResponse = (res: Response, user: IUser, token: string) => {
    return getResponse(res, CREATED, {
      token,
      message: 'Account successfully created',
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
}

const authCtrl = new Auth();
export default authCtrl;
