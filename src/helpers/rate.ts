import { Response } from 'express';
import db from '../db/models';
import { getServerError } from './api';

const countRate = async (res: Response, value: number): Promise<any> => {
  try {
    const result = await db.Rate.count({
      where: { count: value },
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default countRate;
