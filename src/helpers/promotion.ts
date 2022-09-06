import { Response } from 'express';
import db from '../db/models';
import { EPromotionStatus } from '../interfaces/category';
import { getServerError } from './api';

const countAllPromotions = async (res: Response, status: EPromotionStatus): Promise<any> => {
  try {
    const where =
      status === EPromotionStatus.ALL
        ? {}
        : {
            active: status === EPromotionStatus.ACTIVE,
          };

    const ads = await db.Ads.count({ where });
    const story = await db.Story.count({ where });
    const total = ads + story;
    return total;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default countAllPromotions;
