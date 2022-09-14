import dayjs from 'dayjs';
import { Response } from 'express';
import { Op } from 'sequelize';
import db from '../db/models';
import AdsPlan from '../db/models/adsPlan';
import StoryPlan from '../db/models/storyPlan';
import { EPromotionStatus } from '../interfaces/category';
import EPromotionPlan, { EPromotionType } from '../interfaces/promotion';
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

export const countYearlyPromotion = async (
  res: Response,
  type: EPromotionType,
  planType: EPromotionPlan,
): Promise<number | Response> => {
  const currentYear = db.Sequelize.where(
    db.Sequelize.fn('date_part', 'year', db.Sequelize.col('createdAt')),
    dayjs().year().toString(),
  );

  try {
    const result =
      type === EPromotionType.ADS
        ? await db.Ads.count({
            where: { [Op.and]: [currentYear, { plan: planType }] },
          })
        : await db.Story.count({
            where: { [Op.and]: [currentYear, { plan: planType }] },
          });
    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getTotalAmountYearlyPromotion = async (
  res: Response,
  type: EPromotionType,
  planType: EPromotionPlan,
): Promise<any> => {
  const currentYear = db.Sequelize.where(
    db.Sequelize.fn('date_part', 'year', db.Sequelize.col('createdAt')),
    dayjs().year().toString(),
  );

  try {
    const result =
      type === EPromotionType.ADS
        ? await db.Ads.sum('amount', {
            where: { [Op.and]: [currentYear, { plan: planType }] },
          })
        : await db.Story.sum('amount', {
            where: { [Op.and]: [currentYear, { plan: planType }] },
          });
    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default countAllPromotions;
