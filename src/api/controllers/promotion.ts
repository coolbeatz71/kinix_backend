import { Request, Response } from 'express';
import { OK } from 'http-status';
import db from '../../db/models';
import { getPagination, getPagingData, getResponse, getServerError } from '../../helpers/api';

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
}

const promotionCtrl = new Promotion();
export default promotionCtrl;
