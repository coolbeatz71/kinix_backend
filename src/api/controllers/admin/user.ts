/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { OK } from 'http-status';
import { Op } from 'sequelize';
import db from '../../../db/models';
import { getPagination, getPagingData, getResponse, getServerError } from '../../../helpers/api';
import ERole from '../../../interfaces/role';

export class AdminUser {
  /**
   * controller to get all users or search by username or email
   * @param req Request
   * @param res Response
   */
  getAllUsers = async (req: Request, res: Response): Promise<any> => {
    const { search, page = 0, size = 20 } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    const where = search
      ? {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { userName: { [Op.like]: `%${search}%` } },
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
    const { search, page = 0, size = 20 } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    const admins = [
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
            ...admins,
            {
              [Op.or]: [
                { email: { [Op.like]: `%${search}%` } },
                { userName: { [Op.like]: `%${search}%` } },
              ],
            },
          ],
        }
      : undefined;

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
}

const adminUserCtrl = new AdminUser();
export default adminUserCtrl;
