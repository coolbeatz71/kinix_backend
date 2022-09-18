import { Request, Response } from 'express';
import { OK } from 'http-status';
import db from '../../db/models';
import Ads from '../../db/models/ads';
import Story from '../../db/models/story';
import { getPagination, getPagingData, getResponse, getServerError } from '../../helpers/api';
import {
  getBasicAds,
  getBasicStory,
  getFreeAds,
  getFreeStory,
  getPremiumAds,
  getPremiumStory,
  getProfessionalAds,
  getProfessionalStory,
} from '../../helpers/promotion';

export class Promotion {
  /**
   * controller to get the all ads plans
   * @param req Request
   * @param res Response
   */
  getAllAdsPlans = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 20 } = req.query;
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    try {
      const data = await db.AdsPlan.findAndCountAll({
        offset,
        limit: size,
        order: [['createdAt', 'DESC']],
      });

      const result = getPagingData(Number(page), size, data);

      return getResponse(res, OK, {
        data: result,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get the all stories plans
   * @param req Request
   * @param res Response
   */
  getAllStoryPlans = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 20 } = req.query;
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    try {
      const data = await db.StoryPlan.findAndCountAll({
        offset,
        limit: size,
        order: [['createdAt', 'DESC']],
      });

      const result = getPagingData(Number(page), size, data);

      return getResponse(res, OK, {
        data: result,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get the ads to be displayed
   * @param req Request
   * @param res Response
   */
  getAllAds = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const freeAds = (await getFreeAds(res)) as Ads[];
      const basicAds = (await getBasicAds(res)) as Ads[];
      const premiumAds = (await getPremiumAds(res)) as Ads[];
      const professionalAds = (await getProfessionalAds(res)) as Ads[];

      const ads = [...premiumAds, ...professionalAds, ...basicAds, ...freeAds];

      return getResponse(res, OK, {
        data: ads,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get the story to be displayed
   * @param req Request
   * @param res Response
   */
  getAllStory = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const freeStory = (await getFreeStory(res)) as Story[];
      const basicStory = (await getBasicStory(res)) as Story[];
      const premiumStory = (await getPremiumStory(res)) as Story[];
      const professionalStory = (await getProfessionalStory(res)) as Story[];

      const story = [...premiumStory, ...professionalStory, ...basicStory, ...freeStory];

      return getResponse(res, OK, {
        data: story,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const promotionCtrl = new Promotion();
export default promotionCtrl;
