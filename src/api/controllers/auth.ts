/* eslint-disable */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getHashedPassword, getResponse, getServerError } from '../../helpers/api';
import SignupValidator from '../../validator/signup';
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
    await new SignupValidator(req, res).run();

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
        return getResponse(res, httpStatus.CONFLICT, {
          message: `username already taken`,
        });
      }

      if (isEmailExist) {
        return getResponse(res, httpStatus.CONFLICT, {
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

  userResponse = (res: Response, user: IUser, token: string) => {
    return getResponse(res, httpStatus.CREATED, {
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
