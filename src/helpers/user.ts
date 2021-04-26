/* eslint-disable consistent-return */
import { Response } from 'express';
import db from '../db/models';
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
