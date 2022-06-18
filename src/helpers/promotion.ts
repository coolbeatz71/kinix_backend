import { Response } from 'express';
import db from '../db/models';
import { EPromotionStatus } from '../interfaces/category';
import { getServerError } from './api';

const countAllPromotions = async (res: Response, status: EPromotionStatus): Promise<any> => {
  try {
    let result;
    switch (status) {
      case EPromotionStatus.ACTIVE:
        result = db.Promotion.count({
          where: {
            active: true,
          },
        });
        break;
      case EPromotionStatus.INACTIVE:
        result = db.Promotion.count({
          where: {
            active: false,
          },
        });
        break;
      default:
        result = db.Promotion.count();
        break;
    }

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default countAllPromotions;
