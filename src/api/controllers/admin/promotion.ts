/* eslint-disable consistent-return */
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CONFLICT, CREATED, NOT_FOUND, OK } from 'http-status';
import {
  ADS_CREATED_SUCCESS,
  ADS_NOT_FOUND,
  ADS_PLAN_CREATED_SUCCESS,
  ADS_PLAN_UPDATED_SUCCESS,
  ADS_UPDATED_SUCCESS,
  PLAN_NOT_FOUND,
  PLAN_TAKEN,
  STORY_CREATED_SUCCESS,
  STORY_NOT_FOUND,
  STORY_PLAN_CREATED_SUCCESS,
  STORY_PLAN_UPDATED_SUCCESS,
  STORY_UPDATED_SUCCESS,
  USER_NOT_FOUND,
} from '../../../constants/message';
import db from '../../../db/models';
import {
  contentResponse,
  generateSlug,
  getResponse,
  getServerError,
  getValidationError,
} from '../../../helpers/api';
import { getAdsPlanById, getStoryPlanById } from '../../../helpers/promotion';
import { getUserById } from '../../../helpers/user';
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

  /**
   * controller to create an ads
   * @param req Request
   * @param res Response
   */
  createAds = async (req: Request, res: Response): Promise<Response> => {
    const { userId, planId, legend, title, subTitle, body, redirectUrl, image, startDate } =
      req.body;

    await new PromotionValidator(req).createAds();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await getUserById(res, userId);
      const plan = await getAdsPlanById(res, planId);

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const endDate = dayjs(startDate).add(plan.get().duration, 'day').format();

      const slug = await generateSlug(title);
      const newAds = await db.Ads.create({
        slug,
        body,
        title,
        image,
        userId,
        planId,
        legend,
        endDate,
        subTitle,
        startDate,
        redirectUrl,
        active: true,
      });

      return contentResponse(
        res,
        newAds,
        CREATED,
        req.t('ADS_CREATED_SUCCESS'),
        ADS_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to create a story
   * @param req Request
   * @param res Response
   */
  createStory = async (req: Request, res: Response): Promise<Response> => {
    const {
      userId,
      planId,
      legend,
      title,
      subTitle,
      body,
      redirectUrl,
      media,
      mediaType,
      startDate,
    } = req.body;

    await new PromotionValidator(req).createStory();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await getUserById(res, userId);
      const plan = await getStoryPlanById(res, planId);

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const endDate = dayjs(startDate).add(plan.get().duration, 'day').format();

      const slug = await generateSlug(title);
      const newStory = await db.Story.create({
        slug,
        body,
        title,
        media,
        userId,
        planId,
        legend,
        endDate,
        subTitle,
        startDate,
        mediaType,
        redirectUrl,
        active: true,
      });

      return contentResponse(
        res,
        newStory,
        CREATED,
        req.t('STORY_CREATED_SUCCESS'),
        STORY_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update an ads
   * @param req Request
   * @param res Response
   */
  updateAds = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, planId, legend, title, subTitle, body, redirectUrl, image } = req.body;

    await new PromotionValidator(req).updateAds();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await getUserById(res, userId);
      const plan = await getAdsPlanById(res, planId);

      const ads = await db.Ads.findOne({
        where: {
          id,
        },
      });

      if (!ads) {
        return getResponse(res, NOT_FOUND, {
          code: ADS_NOT_FOUND,
          message: req.t('ADS_NOT_FOUND'),
        });
      }

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const slug = await generateSlug(title);
      const updated = await db.Ads.update(
        {
          slug,
          body,
          title,
          image,
          userId,
          planId,
          legend,
          subTitle,
          redirectUrl,
        },
        {
          where: {
            id,
          },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('ADS_UPDATED_SUCCESS'),
        ADS_UPDATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update a story
   * @param req Request
   * @param res Response
   */
  updateStory = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, planId, legend, title, subTitle, body, redirectUrl, media, mediaType } =
      req.body;

    await new PromotionValidator(req).updateStory();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await getUserById(res, userId);
      const plan = await getStoryPlanById(res, planId);

      const ads = await db.Story.findOne({
        where: {
          id,
        },
      });

      if (!ads) {
        return getResponse(res, NOT_FOUND, {
          code: STORY_NOT_FOUND,
          message: req.t('STORY_NOT_FOUND'),
        });
      }

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          code: USER_NOT_FOUND,
          message: req.t('USER_NOT_FOUND'),
        });
      }

      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const slug = await generateSlug(title);
      const updated = await db.Story.update(
        {
          slug,
          body,
          media,
          title,
          userId,
          planId,
          legend,
          subTitle,
          mediaType,
          redirectUrl,
        },
        {
          where: {
            id,
          },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('STORY_UPDATED_SUCCESS'),
        STORY_UPDATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminPromotionCtrl = new AdminPromotion();
export default adminPromotionCtrl;
