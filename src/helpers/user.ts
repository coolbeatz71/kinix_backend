/* eslint-disable consistent-return */
import { Response } from 'express';
import { Op } from 'sequelize';
import db from '../db/models';
import { EUserStatus } from '../interfaces/category';
import ERole from '../interfaces/role';
import { getServerError } from './api';
import EProvider from '../interfaces/provider';

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
export const countUsersBy = async (
  res: Response,
  field: string,
  value: any,
): Promise<Response | number> => {
  try {
    const result = await db.User.count({
      where: { [field]: value },
      attributes: { exclude: ['password'] },
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

// count users by activity status
export const countActiveUsers = async (res: Response) => {
  return countUsersBy(res, 'isLoggedIn', true);
};
export const countInactiveUsers = async (res: Response) => {
  return countUsersBy(res, 'isLoggedIn', false);
};

// count users by login provider
export const countLocalUsers = async (res: Response) => {
  return countUsersBy(res, 'provider', EProvider.LOCAL);
};
export const countGoogleUsers = async (res: Response) => {
  return countUsersBy(res, 'provider', EProvider.GOOGLE);
};
export const countFacebookUsers = async (res: Response) => {
  return countUsersBy(res, 'provider', EProvider.FACEBOOK);
};

// count users by email notification
export const countEmailEnabledUsers = async (res: Response) => {
  return countUsersBy(res, 'allowEmailNotification', true);
};
export const countEmailDisabledUsers = async (res: Response) => {
  return countUsersBy(res, 'allowEmailNotification', false);
};

// count users by role
export const countViewerClients = async (res: Response) => {
  return countUsersBy(res, 'role', ERole.VIEWER_CLIENT);
};
export const countVideoClients = async (res: Response) => {
  return countUsersBy(res, 'role', ERole.VIDEO_CLIENT);
};
export const countAdsClients = async (res: Response) => {
  return countUsersBy(res, 'role', ERole.ADS_CLIENT);
};
export const countAdminUsers = async (res: Response) => {
  return countUsersBy(res, 'role', ERole.ADMIN);
};
export const countSuperAdminUsers = async (res: Response) => {
  return countUsersBy(res, 'role', ERole.SUPER_ADMIN);
};
