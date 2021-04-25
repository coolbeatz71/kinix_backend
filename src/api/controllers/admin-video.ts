/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CONFLICT, CREATED, NOT_FOUND, OK } from 'http-status';
import { Op } from 'sequelize';
import db from '../../db/models';
import { getUserById } from '../../helpers/user';
import VideoValidator from '../../validator/video';
import {
  contentResponse,
  generateSlug,
  getPagination,
  getPagingData,
  getResponse,
  getServerError,
  getValidationError,
} from '../../helpers/api';
import {
  CATEGORY_NOT_FOUND,
  USER_NOT_FOUND,
  VIDEO_ALREADY_ACTIVE,
  VIDEO_ALREADY_INACTIVE,
  VIDEO_APPROVED_SUCCESS,
  VIDEO_CREATED_SUCCESS,
  VIDEO_DELETED_SUCCESS,
  VIDEO_NOT_FOUND,
  VIDEO_UPDATED_SUCCESS,
} from '../../constants/message';
import { getCategoryById, getVideoById, getVideoBySlug } from '../../helpers/video';

export class AdminVideo {
  /**
   * controller to create a video
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<any> => {
    const { title, link, tags, categoryId, userId } = req.body;

    await new VideoValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const slug = await generateSlug(title);

      const category = await getCategoryById(res, categoryId);
      const user = await getUserById(res, userId);

      if (!category) {
        return getResponse(res, NOT_FOUND, {
          message: CATEGORY_NOT_FOUND,
        });
      }

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          message: USER_NOT_FOUND,
        });
      }

      const newVideo = await db.Video.create({
        title,
        link,
        slug,
        tags,
        categoryId,
        userId,
      });

      const getVideo = await getVideoById(res, newVideo.get().id as number, true);

      // TODO: should send email/notification to the video owner
      // TODO: send email/notification to all user in the app

      return contentResponse(res, getVideo.get(), CREATED, VIDEO_CREATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update a video
   * @param req Request
   * @param res Response
   */
  update = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;
    const { title, link, tags, categoryId, userId } = req.body;

    await new VideoValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const user = await getUserById(res, userId);
      const video = await getVideoBySlug(res, slug, true);
      const category = await getCategoryById(res, categoryId);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          message: VIDEO_NOT_FOUND,
        });
      }

      if (!category) {
        return getResponse(res, NOT_FOUND, {
          message: CATEGORY_NOT_FOUND,
        });
      }

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          message: USER_NOT_FOUND,
        });
      }

      const newSlug = await generateSlug(title);

      await db.Video.update(
        {
          title,
          link,
          slug: newSlug,
          tags,
          categoryId,
          userId,
        },
        { where: { id: video.get().id } },
      );

      const getVideo = await getVideoBySlug(res, newSlug);

      // TODO: should send email/notification to the video owner

      return contentResponse(res, getVideo.get(), OK, VIDEO_UPDATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to approve a video
   * @param req Request
   * @param res Response
   */
  approve = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;

    try {
      const video = await getVideoBySlug(res, slug, true);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          message: VIDEO_NOT_FOUND,
        });
      }

      if (video.get().active) {
        return getResponse(res, CONFLICT, {
          message: VIDEO_ALREADY_ACTIVE,
        });
      }

      const update = await db.Video.update(
        {
          active: true,
        },
        { where: { id: video.get().id }, returning: true },
      );

      // TODO: should send email/notification to the video owner

      return contentResponse(res, update[1][0], OK, VIDEO_APPROVED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to delete a video
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;

    try {
      const video = await getVideoBySlug(res, slug, true);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          message: VIDEO_NOT_FOUND,
        });
      }

      if (!video.get().active) {
        return getResponse(res, CONFLICT, {
          message: VIDEO_ALREADY_INACTIVE,
        });
      }

      const update = await db.Video.update(
        {
          active: false,
        },
        { where: { id: video.get().id }, returning: true },
      );

      // TODO: should send email/notification to the video owner

      return contentResponse(res, update[1][0], OK, VIDEO_DELETED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all video or search video by title
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<any> => {
    const { page = 0, size = 20, title } = req.query;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : undefined;
    const { limit, offset } = getPagination(Number(page), Number(size));

    try {
      const data = await db.Video.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
      });
      const result = getPagingData(Number(page), limit, data);

      return getResponse(res, OK, {
        data: result,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get a single video using slug
   * @description also returns inactive videos
   * @param req Request
   * @param res Response
   */
  get = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;

    try {
      const video = await getVideoBySlug(res, slug, true);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          message: VIDEO_NOT_FOUND,
        });
      }

      return contentResponse(res, video, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminVideoCtrl = new AdminVideo();
export default adminVideoCtrl;
