/* eslint-disable consistent-return */
import { Response } from 'express';
import { NOT_FOUND } from 'http-status';
import { USER_NOT_FOUND } from '../api/constants/message';
import db from '../db/models';
import { getResponse, getServerError } from './api';

const user = async (res: Response, field: string, value: any) => {
  try {
    const result = await db.User.findOne({
      where: { [field]: value },
    });

    return (
      result &&
      getResponse(res, NOT_FOUND, {
        message: USER_NOT_FOUND,
      })
    );
  } catch (err) {
    getServerError(res, err.message);
  }
};

export const getUserByName = async (res: Response, userName: string): Promise<any> => {
  return user(res, 'userName', userName);
};

export const getUserById = async (res: Response, id: number): Promise<any> => {
  return user(res, 'id', id);
};
