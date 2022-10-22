import { Response } from 'express';
import db from '../db/models';
import { getServerError } from './api';

// get all videos that a user shared
const getSharesByUserId = async (res: Response, userId: number): Promise<any> => {
  try {
    const result = await db.Share.findAndCountAll({
      where: { userId },
      include: [
        {
          as: 'video',
          model: db.Video,
        },
      ],
    });
    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default getSharesByUserId;
