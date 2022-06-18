/* eslint-disable consistent-return */
import { Response } from 'express';
import { Op } from 'sequelize';
import db from '../db/models';
import { EUserStatus } from '../interfaces/category';
import ERole from '../interfaces/role';
import { getServerError } from './api';

const user = async (res: Response, field: string, value: any): Promise<any> => {
  try {
    const result = await db.User.findOne({
      where: { [field]: value },
      attributes: { exclude: ['password'] },
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getUserByName = async (res: Response, userName: string): Promise<any> => {
  return user(res, 'userName', userName);
};

export const getUserById = async (res: Response, id: number): Promise<any> => {
  return user(res, 'id', id);
};

export const countTotalUsers = async (res: Response, status: EUserStatus): Promise<any> => {
  const admins = [
    {
      role: { [Op.ne]: ERole.ADMIN },
    },
    {
      role: { [Op.ne]: ERole.SUPER_ADMIN },
    },
  ];

  const where =
    status === EUserStatus.ALL
      ? {
          [Op.and]: [...admins],
        }
      : {
          [Op.and]: [
            ...admins,
            {
              verified: status === EUserStatus.VERIFIED,
            },
          ],
        };

  try {
    const result = await db.User.count({
      where,
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};
