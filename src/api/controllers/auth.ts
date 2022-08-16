/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from 'http-status';
import { validationResult } from 'express-validator';
import { isEmpty } from 'lodash';
import {
  comparePassword,
  getHashedPassword,
  getResponse,
  getServerError,
  getUserResponse,
  getValidationError,
} from '../../helpers/api';
import AuthValidator from '../../validator/auth';
import { generateToken } from '../../helpers/jwt';
import db from '../../db/models';
import {
  ACCOUNT_CREATED_SUCCESS,
  ACCOUNT_EXIST,
  ACCOUNT_UPDATED_SUCCESS,
  AVATAR_UPDATED_SUCCESS,
  CHECK_CONFIRM_EMAIL,
  GET_USER_SUCCESS,
  NEW_PASSWORD_SAME_AS_OLD,
  OLD_PASSWORD_INVALID,
  PASSWORD_CHANGED_SUCCESS,
  PASSWORD_INVALID,
  PHONE_NUMBER_TAKEN,
  SIGNOUT_SUCCESS,
  USERNAME_EMAIL_INVALID,
  USERNAME_TAKEN,
  USER_BLOCKED,
  USER_LOGIN_SUCCESS,
  USER_NOT_FOUND,
} from '../../constants/message';
import { IJwtPayload } from '../../interfaces/api';
import ERole from '../../interfaces/role';
import { getUserById } from '../../helpers/user';
import { IUnknownObject } from '../../interfaces/unknownObject';

export class Auth {
  /**
   * controller to sign up the user
   * @param req Request
   * @param res Response
   */
  signup = async (req: Request, res: Response): Promise<Response> => {
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

      return getUserResponse(res, newUser.get(), token, CREATED, ACCOUNT_CREATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to login the user
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

      if (user.get().active === false) {
        return getResponse(res, FORBIDDEN, {
          message: USER_BLOCKED,
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

  /**
   * controller to get the current user
   * @param req Request
   * @param res Response
   */
  getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.user as IJwtPayload;
      const user = await getUserById(res, id);

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          message: USER_NOT_FOUND,
        });
      }

      if (user.get().active === false) {
        return getResponse(res, FORBIDDEN, {
          message: USER_BLOCKED,
        });
      }

      return getUserResponse(res, user, '', OK, GET_USER_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * The controller for signing out
   * @param req Request
   * @param res Response
   */
  signout = async (req: Request, res: Response): Promise<Response> => {
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

  /**
   * The controller to update user account info
   * @param req Request
   * @param res Response
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    const { email: currentEmail, id } = req.user as IJwtPayload;
    const { userName, phoneNumber, email } = req.body;
    let newValues: IUnknownObject = { userName, phoneNumber, email };

    const isEmailUpdated = !isEmpty(email) && currentEmail !== email;
    try {
      if (isEmailUpdated) {
        newValues = { ...newValues, verified: false, isLoggedIn: false };
      }

      const isUserNameExist = await db.User.findOne({
        where: {
          userName,
        },
      });

      const isPhoneNumberExist = await db.User.findOne({
        where: {
          phoneNumber,
        },
      });

      if (isUserNameExist && isUserNameExist.id !== id) {
        return getResponse(res, CONFLICT, {
          message: USERNAME_TAKEN,
        });
      }

      if (isPhoneNumberExist && isPhoneNumberExist.id !== id) {
        return getResponse(res, CONFLICT, {
          message: PHONE_NUMBER_TAKEN,
        });
      }

      const update = await db.User.update(
        {
          ...newValues,
        },
        { where: { id }, returning: true },
      );

      return getUserResponse(res, update[1][0].get(), '', OK, ACCOUNT_UPDATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * The controller to change password
   * @param req Request
   * @param res Response
   */
  changePassword = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.user as IJwtPayload;
    const { oldPassword, newPassword } = req.body;

    await new AuthValidator(req).changePassword();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await db.User.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          message: USER_NOT_FOUND,
        });
      }

      const isOldPasswordValid = comparePassword(oldPassword, user.get().password);
      const isNewPasswordSameAsOld = comparePassword(newPassword, user.get().password);

      if (!isOldPasswordValid) {
        return getResponse(res, BAD_REQUEST, {
          message: OLD_PASSWORD_INVALID,
        });
      }

      if (isNewPasswordSameAsOld) {
        return getResponse(res, FORBIDDEN, {
          message: NEW_PASSWORD_SAME_AS_OLD,
        });
      }

      const hashPassword = getHashedPassword(newPassword);
      const update = await db.User.update(
        {
          password: hashPassword,
        },
        { where: { id }, returning: true },
      );

      return getUserResponse(res, update[1][0].get(), '', OK, PASSWORD_CHANGED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * The controller to update user avatar
   * @param req Request
   * @param res Response
   */
  updateAvatar = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.user as IJwtPayload;
    const { avatar } = req.body;

    await new AuthValidator(req).changeAvatar();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await db.User.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          message: USER_NOT_FOUND,
        });
      }

      const update = await db.User.update(
        {
          image: avatar,
        },
        { where: { id }, returning: true },
      );

      return getUserResponse(res, update[1][0].get(), '', OK, AVATAR_UPDATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const authCtrl = new Auth();
export default authCtrl;
