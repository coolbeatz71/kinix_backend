import { Response } from 'express';
import { Op } from 'sequelize';
import db from '../db/models';
import { getServerError } from './api';

const countRate = async (res: Response, videoId: number, value: number): Promise<any> => {
  try {
    const result = await db.Rate.count({
      where: { [Op.and]: [{ count: value }, { videoId }] },
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default countRate;
