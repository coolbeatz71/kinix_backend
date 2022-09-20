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
  EMAIL_TAKEN,
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
  OTP_ALREADY_VERIFIED,
  OTP_INCORRECT,
  OTP_VERIFIED_SUCCESS,
  OTP_RESEND_SUCCESS,
} from '../../constants/message';
import { IJwtPayload } from '../../interfaces/api';
import ERole from '../../interfaces/role';
import { getUserById } from '../../helpers/user';
import { IUnknownObject } from '../../interfaces/unknownObject';
import generateOTP from '../../helpers/otp';

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
          code: USERNAME_TAKEN,
          message: req.t('USERNAME_TAKEN'),
        });
      }

      if (isEmailExist) {
        return getResponse(res, CONFLICT, {
          code: EMAIL_TAKEN,
          message: req.t('EMAIL_TAKEN'),
        });
      }

      const otp = generateOTP(6);
      const hashPassword = getHashedPassword(password);

      const newUser = await db.User.create({
        otp,
        email,
        userName,
        password: hashPassword,
      });

      const token = generateToken(newUser?.get());

      // TODO: should send email here for email confirmation

      return getUserResponse(
        res,
        newUser?.get(),
        token,
        CREATED,
        req.t('ACCOUNT_CREATED_SUCCESS'),
        ACCOUNT_CREATED_SUCCESS,
      );
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
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, user?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      // handle non verified account
      if (user?.get().verified === false) {
        // TODO should resend email confirmation here
        return getResponse(res, BAD_REQUEST, {
          code: CHECK_CONFIRM_EMAIL,
          message: req.t('CHECK_CONFIRM_EMAIL'),
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

  /**
   * controller to verify user account
   * @param req Request
   * @param res Response
   */
  confirmAccount = async (req: Request, res: Response): Promise<Response> => {
    const { otp, credential } = req.body;

    await new AuthValidator(req).confirmAccount();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await db.User.findOne({
        where: {
          [Op.or]: [{ userName: credential }, { email: credential }],
        },
      });

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (user?.get().active === false) {
        return getResponse(res, FORBIDDEN, {
          code: USER_BLOCKED,
          message: req.t('USER_BLOCKED'),
        });
      }

      if (user?.get().verified === true) {
        return getResponse(res, CONFLICT, {
          code: OTP_ALREADY_VERIFIED,
          message: req.t('OTP_ALREADY_VERIFIED'),
        });
      }

      if (user?.get().otp !== otp) {
        return getResponse(res, BAD_REQUEST, {
          code: OTP_INCORRECT,
          message: req.t('OTP_INCORRECT'),
        });
      }

      const update = await db.User.update(
        {
          verified: true,
          isLoggedIn: true,
        },
        { where: { id: user.id }, returning: true },
      );

      const token = generateToken(
        user?.get(),
        user?.get().role === ERole.ADMIN || user?.get().role === ERole.SUPER_ADMIN,
      );

      return getUserResponse(
        res,
        update[1][0]?.get(),
        token,
        OK,
        req.t('OTP_VERIFIED_SUCCESS'),
        OTP_VERIFIED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  resentOtpCode = async (req: Request, res: Response): Promise<Response> => {
    const { credential } = req.body;

    await new AuthValidator(req).resendOTP();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await db.User.findOne({
        where: {
          [Op.or]: [{ userName: credential }, { email: credential }],
        },
      });

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (user?.get().active === false) {
        return getResponse(res, FORBIDDEN, {
          code: USER_BLOCKED,
          message: req.t('USER_BLOCKED'),
        });
      }

      if (user?.get().verified === true) {
        return getResponse(res, CONFLICT, {
          code: OTP_ALREADY_VERIFIED,
          message: req.t('OTP_ALREADY_VERIFIED'),
        });
      }

      const otp = generateOTP(6);
      const update = await db.User.update({ otp }, { where: { id: user.id }, returning: true });

      const token = generateToken(
        user?.get(),
        user?.get().role === ERole.ADMIN || user?.get().role === ERole.SUPER_ADMIN,
      );
      return getUserResponse(
        res,
        update[1][0],
        token,
        OK,
        req.t('OTP_RESEND_SUCCESS'),
        OTP_RESEND_SUCCESS,
      );
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
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (user?.get().active === false) {
        return getResponse(res, FORBIDDEN, {
          code: USER_BLOCKED,
          message: req.t('USER_BLOCKED'),
        });
      }

      return getUserResponse(res, user, '', OK, req.t('GET_USER_SUCCESS'), GET_USER_SUCCESS);
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
    const { email, userName, countryName, countryFlag, phonePartial, phoneISOCode, phoneDialCode } =
      req.body;

    let newValues: IUnknownObject = {
      email,
      userName,
      countryName,
      countryFlag,
      phonePartial,
      phoneISOCode,
      phoneDialCode,
      phoneNumber: `${phoneDialCode}${phonePartial}`,
    };

    const isPhonePartial = !isEmpty(phonePartial);
    const isEmailUpdated = !isEmpty(email) && currentEmail !== email;

    await new AuthValidator(req).update(isPhonePartial, {
      countryFlag,
      phonePartial,
      phoneISOCode,
      phoneDialCode,
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      if (isEmailUpdated) {
        newValues = { ...newValues, verified: false, isLoggedIn: false };
      }

      const isEmailExist = await db.User.findOne({
        where: {
          email,
        },
      });

      const isUserNameExist = await db.User.findOne({
        where: {
          userName,
        },
      });

      const isPhoneNumberExist = await db.User.findOne({
        where: {
          phoneNumber: `${phoneDialCode}${phonePartial}` || null,
        },
      });

      if (isUserNameExist && isUserNameExist.id !== id) {
        return getResponse(res, CONFLICT, {
          code: USERNAME_TAKEN,
          message: req.t('USERNAME_TAKEN'),
        });
      }

      if (isPhoneNumberExist && isPhoneNumberExist.id !== id) {
        return getResponse(res, CONFLICT, {
          code: PHONE_NUMBER_TAKEN,
          message: req.t('PHONE_NUMBER_TAKEN'),
        });
      }

      if (isEmailExist && isEmailExist.id !== id) {
        return getResponse(res, CONFLICT, {
          code: EMAIL_TAKEN,
          message: req.t('EMAIL_TAKEN'),
        });
      }

      const update = await db.User.update(
        {
          ...newValues,
        },
        { where: { id }, returning: true },
      );

      return getUserResponse(
        res,
        update[1][0]?.get(),
        '',
        OK,
        req.t('ACCOUNT_UPDATED_SUCCESS'),
        ACCOUNT_UPDATED_SUCCESS,
      );
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
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      const isOldPasswordValid = comparePassword(oldPassword, user?.get().password);
      const isNewPasswordSameAsOld = comparePassword(newPassword, user?.get().password);

      if (!isOldPasswordValid) {
        return getResponse(res, BAD_REQUEST, {
          code: OLD_PASSWORD_INVALID,
          message: req.t('OLD_PASSWORD_INVALID'),
        });
      }

      if (isNewPasswordSameAsOld) {
        return getResponse(res, FORBIDDEN, {
          code: NEW_PASSWORD_SAME_AS_OLD,
          message: req.t('NEW_PASSWORD_SAME_AS_OLD'),
        });
      }

      const hashPassword = getHashedPassword(newPassword);
      const update = await db.User.update(
        {
          password: hashPassword,
        },
        { where: { id }, returning: true },
      );

      return getUserResponse(
        res,
        update[1][0]?.get(),
        '',
        OK,
        req.t('PASSWORD_CHANGED_SUCCESS'),
        PASSWORD_CHANGED_SUCCESS,
      );
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
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      const update = await db.User.update(
        {
          image: avatar,
        },
        { where: { id }, returning: true },
      );

      return getUserResponse(
        res,
        update[1][0]?.get(),
        '',
        OK,
        req.t('AVATAR_UPDATED_SUCCESS'),
        AVATAR_UPDATED_SUCCESS,
      );
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
        code: SIGNOUT_SUCCESS,
        message: req.t('SIGNOUT_SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const authCtrl = new Auth();
export default authCtrl;
