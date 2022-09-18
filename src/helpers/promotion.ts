import dayjs from 'dayjs';
import { Response } from 'express';
import { shuffle } from 'lodash';
import { Op } from 'sequelize';
import db from '../db/models';
import Ads from '../db/models/ads';
import AdsPlan from '../db/models/adsPlan';
import Story from '../db/models/story';
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

const ads = async (
  res: Response,
  field: string,
  value: EPromotionPlan,
): Promise<Ads[] | Response> => {
  try {
    const data = await db.Ads.findAll({
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ [field]: value }, { active: true }] },
    });

    return shuffle(data);
  } catch (err) {
    return getServerError(res, err.message);
  }
};

const story = async (
  res: Response,
  field: string,
  value: EPromotionPlan,
): Promise<Story[] | Response> => {
  try {
    const data = await db.Story.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ [field]: value }, { active: true }] },
    });

    return shuffle(data);
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

// active ads
export const getFreeAds = async (res: Response) => {
  return ads(res, 'plan', EPromotionPlan.FREE);
};
export const getBasicAds = async (res: Response) => {
  return ads(res, 'plan', EPromotionPlan.BASIC);
};
export const getProfessionalAds = async (res: Response) => {
  return ads(res, 'plan', EPromotionPlan.PROFESSIONAL);
};
export const getPremiumAds = async (res: Response) => {
  return ads(res, 'plan', EPromotionPlan.PREMIUM);
};

// active stories
export const getFreeStory = async (res: Response) => {
  return story(res, 'plan', EPromotionPlan.FREE);
};
export const getBasicStory = async (res: Response) => {
  return story(res, 'plan', EPromotionPlan.BASIC);
};
export const getProfessionalStory = async (res: Response) => {
  return story(res, 'plan', EPromotionPlan.PROFESSIONAL);
};
export const getPremiumStory = async (res: Response) => {
  return story(res, 'plan', EPromotionPlan.PREMIUM);
};

export default countAllPromotions;
