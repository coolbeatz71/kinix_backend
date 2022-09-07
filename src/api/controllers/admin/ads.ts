/* eslint-disable consistent-return */
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CONFLICT, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } from 'http-status';
import { isEmpty, lowerCase } from 'lodash';
import { Op } from 'sequelize';
import {
  ADS_ACTIVATED_SUCCESS,
  ADS_ALREADY_ACTIVE,
  ADS_ALREADY_INACTIVE,
  ADS_CREATED_SUCCESS,
  ADS_DELETED_SUCCESS,
  ADS_DISABLED_SUCCESS,
  ADS_NOT_FOUND,
  ADS_PLAN_CREATED_SUCCESS,
  ADS_PLAN_UPDATED_SUCCESS,
  ADS_UPDATED_SUCCESS,
  PASSWORD_INVALID,
  PASSWORD_REQUIRED,
  PLAN_NOT_FOUND,
  PLAN_TAKEN,
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
import { getAdsPlanById } from '../../../helpers/promotion';
import { getUserById } from '../../../helpers/user';
import { EnumStatus, IJwtPayload } from '../../../interfaces/api';
import PromotionValidator from '../../../validator/promotion';

export class AdminAds {
  /**
   * controller to create ads plan
   * @param req Request
   * @param res Response
   */
  createPlan = async (req: Request, res: Response): Promise<Response> => {
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
   * controller to update ads plan
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
   * controller to create an ads
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
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
   * controller to update an ads
   * @param req Request
   * @param res Response
   */
  update = async (req: Request, res: Response): Promise<Response> => {
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
   * controller to delete an ads
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

      const isPasswordValid = comparePassword(password, admin.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

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

      await db.Ads.destroy({ where: { id: ads.get().id } });
      return getResponse(res, OK, {
        code: ADS_DELETED_SUCCESS,
        message: req.t('ADS_DELETED_SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to disable an ads
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

      const isPasswordValid = comparePassword(password, admin.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

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

      if (ads.active === false) {
        return getResponse(res, CONFLICT, {
          code: ADS_ALREADY_INACTIVE,
          message: req.t('ADS_ALREADY_INACTIVE'),
        });
      }

      const updated = await db.Ads.update(
        {
          active: false,
        },
        {
          where: { id: ads.get().id },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('ADS_DISABLED_SUCCESS'),
        ADS_DISABLED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to enable an ads
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

      const isPasswordValid = comparePassword(password, admin.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

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

      if (ads.active === true) {
        return getResponse(res, CONFLICT, {
          code: ADS_ALREADY_ACTIVE,
          message: req.t('ADS_ALREADY_ACTIVE'),
        });
      }

      const plan = await getAdsPlanById(res, ads.planId);
      if (!plan) {
        return getResponse(res, NOT_FOUND, {
          code: PLAN_NOT_FOUND,
          message: req.t('PLAN_NOT_FOUND'),
        });
      }

      const endDate = dayjs(startDate).add(plan.get().duration, 'day').format();
      const updated = await db.Ads.update(
        {
          endDate,
          startDate,
          active: true,
        },
        {
          where: { id: ads.get().id },
          returning: true,
        },
      );

      return contentResponse(
        res,
        updated[1][0],
        OK,
        req.t('ADS_ACTIVATED_SUCCESS'),
        ADS_ACTIVATED_SUCCESS,
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
    const isActive = status === lowerCase(EnumStatus.ACTIVE);
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
      const data = await db.Ads.findAndCountAll({
        offset,
        limit: size,
        order: [['createdAt', 'DESC']],
        where: { [Op.and]: [{ ...whereSearch, ...whereStatus }] },
        include: [
          {
            as: 'user',
            model: db.User,
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
          },
          {
            as: 'ads_plan',
            model: db.AdsPlan,
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

const adminAdsCtrl = new AdminAds();
export default adminAdsCtrl;
