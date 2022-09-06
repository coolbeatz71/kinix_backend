/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CONFLICT, CREATED, NOT_FOUND, OK } from 'http-status';
import {
  ADS_PLAN_CREATED_SUCCESS,
  ADS_PLAN_UPDATED_SUCCESS,
  PLAN_NOT_FOUND,
  PLAN_TAKEN,
  STORY_PLAN_CREATED_SUCCESS,
  STORY_PLAN_UPDATED_SUCCESS,
} from '../../../constants/message';
import db from '../../../db/models';
import {
  contentResponse,
  getResponse,
  getServerError,
  getValidationError,
} from '../../../helpers/api';
import PromotionValidator from '../../../validator/promotion';

export class AdminPromotion {
  /**
   * controller to create ads plan
   * @param req Request
   * @param res Response
   */
  createAdsPlan = async (req: Request, res: Response): Promise<Response> => {
    const { name, price, duration } = req.body;

    await new PromotionValidator(req).createPlan();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const plan = await db.AdsPlan.findOne({
        where: {
          name,
        },
      });

      if (plan) {
        return getResponse(res, CONFLICT, {
          code: PLAN_TAKEN,
          message: req.t('PLAN_TAKEN'),
        });
      }

      const newAdsPlan = await db.AdsPlan.create({
        name,
        price,
        duration,
      });

      return contentResponse(
        res,
        newAdsPlan,
        CREATED,
        req.t('ADS_PLAN_CREATED_SUCCESS'),
        ADS_PLAN_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to create story plan
   * @param req Request
   * @param res Response
   */
  createStoryPlan = async (req: Request, res: Response): Promise<Response> => {
    const { name, price, duration } = req.body;

    await new PromotionValidator(req).createPlan();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const plan = await db.StoryPlan.findOne({
        where: {
          name,
        },
      });

      if (plan) {
        return getResponse(res, CONFLICT, {
          code: PLAN_TAKEN,
          message: req.t('PLAN_TAKEN'),
        });
      }

      const newStoryPlan = await db.StoryPlan.create({
        name,
        price,
        duration,
      });

      return contentResponse(
        res,
        newStoryPlan,
        CREATED,
        req.t('STORY_PLAN_CREATED_SUCCESS'),
        STORY_PLAN_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update ads plan
   * @param req Request
   * @param res Response
   */
  updateAdsPlan = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, price, duration } = req.body;

    await new PromotionValidator(req).createPlan();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const plan = await db.AdsPlan.findOne({
        where: {
          id,
        },
      });

      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const updated = await db.AdsPlan.update(
        {
          name,
          price,
          duration,
        },
        {
          where: { id },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('ADS_PLAN_UPDATED_SUCCESS'),
        ADS_PLAN_UPDATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update story plan
   * @param req Request
   * @param res Response
   */
  updateStoryPlan = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, price, duration } = req.body;

    await new PromotionValidator(req).createPlan();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const plan = await db.StoryPlan.findOne({
        where: {
          id,
        },
      });

      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const updated = await db.StoryPlan.update(
        {
          name,
          price,
          duration,
        },
        {
          where: { id },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('STORY_PLAN_UPDATED_SUCCESS'),
        STORY_PLAN_UPDATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminPromotionCtrl = new AdminPromotion();
export default adminPromotionCtrl;
