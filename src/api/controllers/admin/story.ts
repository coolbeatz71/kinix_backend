/* eslint-disable consistent-return */
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CONFLICT, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } from 'http-status';
import { isEmpty, toLower } from 'lodash';
import { Op } from 'sequelize';
import {
  PASSWORD_INVALID,
  PASSWORD_REQUIRED,
  PLAN_NOT_FOUND,
  PLAN_TAKEN,
  STORY_ACTIVATED_SUCCESS,
  STORY_ALREADY_ACTIVE,
  STORY_ALREADY_INACTIVE,
  STORY_CREATED_SUCCESS,
  STORY_DELETED_SUCCESS,
  STORY_DISABLED_SUCCESS,
  STORY_NOT_FOUND,
  STORY_PLAN_CREATED_SUCCESS,
  STORY_PLAN_UPDATED_SUCCESS,
  STORY_UPDATED_SUCCESS,
  USERNAME_EMAIL_INVALID,
  USER_NOT_FOUND,
} from '../../../constants/message';
import db from '../../../db/models';
import {
  comparePassword,
  contentResponse,
  generateSlug,
  getPagination,
  getPagingData,
  getResponse,
  getServerError,
  getValidationError,
} from '../../../helpers/api';
import { getStoryPlanById } from '../../../helpers/promotion';
import { getUserById } from '../../../helpers/user';
import { EnumStatus, IJwtPayload } from '../../../interfaces/api';
import PromotionValidator from '../../../validator/promotion';

export class AdminStory {
  /**
   * controller to create story plan
   * @param req Request
   * @param res Response
   */
  createPlan = async (req: Request, res: Response): Promise<Response> => {
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
   * controller to update story plan
   * @param req Request
   * @param res Response
   */
  updatePlan = async (req: Request, res: Response): Promise<Response> => {
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
   * controller to create a story
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
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

      const endDate = dayjs(startDate).add(plan?.get().duration, 'day').format();

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
        plan: plan?.get().name,
        amount: plan?.get().price,
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
   * controller to update a story
   * @param req Request
   * @param res Response
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, planId, legend, title, subTitle, body, redirectUrl, media, mediaType } =
      req.body;

    await new PromotionValidator(req).updateStory();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await getUserById(res, userId);
      const plan = await getStoryPlanById(res, planId);

      const story = await db.Story.findOne({
        where: {
          id,
        },
      });

      if (!story) {
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
          plan: plan?.get().name,
          amount: plan?.get().price,
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

  /**
   * controller to delete a story
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        code: PASSWORD_REQUIRED,
        message: req.t('PASSWORD_REQUIRED'),
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });

      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, admin?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      const story = await db.Story.findOne({
        where: {
          id,
        },
      });

      if (!story) {
        return getResponse(res, NOT_FOUND, {
          code: STORY_NOT_FOUND,
          message: req.t('STORY_NOT_FOUND'),
        });
      }

      await db.Story.destroy({ where: { id: story?.get().id } });
      return getResponse(res, OK, {
        code: STORY_DELETED_SUCCESS,
        message: req.t('STORY_DELETED_SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to disable a story
   * @param req Request
   * @param res Response
   */
  disable = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        code: PASSWORD_REQUIRED,
        message: req.t('PASSWORD_REQUIRED'),
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });

      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, admin?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      const story = await db.Story.findOne({
        where: {
          id,
        },
      });

      if (!story) {
        return getResponse(res, NOT_FOUND, {
          code: STORY_NOT_FOUND,
          message: req.t('STORY_NOT_FOUND'),
        });
      }

      if (story.active === false) {
        return getResponse(res, CONFLICT, {
          code: STORY_ALREADY_INACTIVE,
          message: req.t('STORY_ALREADY_INACTIVE'),
        });
      }

      const updated = await db.Story.update(
        {
          active: false,
        },
        {
          where: { id: story?.get().id },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('STORY_DISABLED_SUCCESS'),
        STORY_DISABLED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to enable a story
   * @param req Request
   * @param res Response
   */
  enable = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { password, startDate } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        code: PASSWORD_REQUIRED,
        message: req.t('PASSWORD_REQUIRED'),
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });

      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, admin?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      const story = await db.Story.findOne({
        where: {
          id,
        },
      });

      if (!story) {
        return getResponse(res, NOT_FOUND, {
          code: STORY_NOT_FOUND,
          message: req.t('STORY_NOT_FOUND'),
        });
      }

      if (story.active === true) {
        return getResponse(res, CONFLICT, {
          code: STORY_ALREADY_ACTIVE,
          message: req.t('STORY_ALREADY_ACTIVE'),
        });
      }

      const plan = await getStoryPlanById(res, story.planId);
      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const endDate = dayjs(startDate).add(plan?.get().duration, 'day').format();
      const updated = await db.Story.update(
        {
          endDate,
          startDate,
          active: true,
        },
        {
          where: { id: story?.get().id },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('STORY_ACTIVATED_SUCCESS'),
        STORY_ACTIVATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all ads or search ads by title
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 20, search, status } = req.query;
    const isStatus = !isEmpty(status);
    const isActive = status === toLower(EnumStatus.ACTIVE);
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    const whereStatus = isStatus
      ? {
          active: isActive,
        }
      : undefined;
    const whereSearch = search
      ? {
          [Op.or]: [
            {
              title: { [Op.iLike]: `%${search}%` },
            },
            {
              body: { [Op.iLike]: `%${search}%` },
            },
            {
              subTitle: { [Op.iLike]: `%${search}%` },
            },
            {
              legend: { [Op.iLike]: `%${search}%` },
            },
          ],
        }
      : undefined;

    try {
      const data = await db.Story.findAndCountAll({
        offset,
        limit: size,
        distinct: true,
        order: [['createdAt', 'DESC']],
        where: { [Op.and]: [{ ...whereSearch, ...whereStatus }] },
        include: [
          {
            as: 'user',
            model: db.User,
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
          },
          {
            as: 'story_plan',
            model: db.StoryPlan,
          },
        ],
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

const adminStoryCtrl = new AdminStory();
export default adminStoryCtrl;
