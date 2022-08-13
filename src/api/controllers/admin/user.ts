/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { CONFLICT, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } from 'http-status';
import { Op } from 'sequelize';
import {
  PASSWORD_INVALID,
  PASSWORD_REQUIRED,
  USERNAME_EMAIL_INVALID,
  USER_ALREADY_ACTIVE,
  USER_ALREADY_BLOCKED,
  USER_BLOCKED_SUCCESS,
  USER_DELETED_SUCCESS,
  USER_NOT_FOUND,
  USER_UNBLOCKED_SUCCESS,
} from '../../../constants/message';
import db from '../../../db/models';
import {
  comparePassword,
  contentResponse,
  getPagination,
  getPagingData,
  getResponse,
  getServerError,
} from '../../../helpers/api';
import { IJwtPayload } from '../../../interfaces/api';
import ERole from '../../../interfaces/role';

export class AdminUser {
  /**
   * controller to get all users or search by username or email
   * @param req Request
   * @param res Response
   */
  getAllUsers = async (req: Request, res: Response): Promise<any> => {
    const { search, page = 1, size = 20 } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    const where = search
      ? {
          [Op.or]: [
            { email: { [Op.iLike]: `%${search}%` } },
            { userName: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : undefined;

    try {
      const data = await db.User.findAndCountAll({
        where,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
        attributes: { exclude: ['password', 'role'] },
      });
      const result = getPagingData(Number(page), limit, data);

      return getResponse(res, OK, {
        data: result,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all clients or search by username or email
   * @param req Request
   * @param res Response
   */
  getAllClients = async (req: Request, res: Response): Promise<any> => {
    const { search, page = 1, size = 20 } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    const excludeAdmins = [
      {
        role: { [Op.ne]: ERole.ADMIN },
      },
      {
        role: { [Op.ne]: ERole.SUPER_ADMIN },
      },
    ];
    const where = search
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { email: { [Op.iLike]: `%${search}%` } },
                { userName: { [Op.iLike]: `%${search}%` } },
              ],
            },
            ...excludeAdmins,
          ],
        }
      : {
          [Op.and]: [...excludeAdmins],
        };

    try {
      const data = await db.User.findAndCountAll({
        where,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
        attributes: { exclude: ['password'] },
      });
      const result = getPagingData(Number(page), limit, data);

      return getResponse(res, OK, {
        data: result,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to unblock a user
   * @param req Request
   * @param res Response
   */
  unblock = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        message: PASSWORD_REQUIRED,
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          message: USERNAME_EMAIL_INVALID,
        });
      }

      const isPasswordValid = comparePassword(password, admin.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          message: PASSWORD_INVALID,
        });
      }

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

      if (user.get().active) {
        return getResponse(res, CONFLICT, {
          message: USER_ALREADY_ACTIVE,
        });
      }

      const update = await db.User.update(
        {
          active: true,
        },
        { where: { id }, returning: true },
      );

      return contentResponse(res, update[1][0], OK, USER_UNBLOCKED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to block a user
   * @param req Request
   * @param res Response
   */
  block = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        message: PASSWORD_REQUIRED,
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          message: USERNAME_EMAIL_INVALID,
        });
      }

      const isPasswordValid = comparePassword(password, admin.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          message: PASSWORD_INVALID,
        });
      }

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

      if (!user.get().active) {
        return getResponse(res, CONFLICT, {
          message: USER_ALREADY_BLOCKED,
        });
      }

      const update = await db.User.update(
        {
          active: false,
        },
        { where: { id }, returning: true },
      );

      return contentResponse(res, update[1][0], OK, USER_BLOCKED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to delete a user from the DB
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        message: PASSWORD_REQUIRED,
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          message: USERNAME_EMAIL_INVALID,
        });
      }

      const isPasswordValid = comparePassword(password, admin.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          message: PASSWORD_INVALID,
        });
      }

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

      await db.User.destroy({ where: { id } });
      return getResponse(res, OK, {
        message: USER_DELETED_SUCCESS,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminUserCtrl = new AdminUser();
export default adminUserCtrl;
