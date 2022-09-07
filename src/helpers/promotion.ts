import { Response } from 'express';
import db from '../db/models';
import AdsPlan from '../db/models/adsPlan';
import StoryPlan from '../db/models/storyPlan';
import { EPromotionStatus } from '../interfaces/category';
import { EPromotionType } from '../interfaces/promotion';
import { IUnknownObject } from '../interfaces/unknownObject';
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

const plan = async (
  res: Response,
  field: string,
  value: any,
  type: EPromotionType,
): Promise<AdsPlan | StoryPlan | IUnknownObject | null> => {
  try {
    const result =
      type === EPromotionType.ADS
        ? await db.AdsPlan.findOne({
            where: { [field]: value },
          })
        : await db.StoryPlan.findOne({
            where: { [field]: value },
          });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getAdsPlanById = async (res: Response, id: number) => {
  return plan(res, 'id', id, EPromotionType.ADS);
};

export const getStoryPlanById = async (res: Response, id: number) => {
  return plan(res, 'id', id, EPromotionType.STORY);
};

export default countAllPromotions;
