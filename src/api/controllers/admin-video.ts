/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CREATED, NOT_FOUND, OK } from 'http-status';
import { Op } from 'sequelize';
import db from '../../db/models';
import { IVideo } from '../../interfaces/model';
import { getUserById } from '../../helpers/user';
import VideoValidator from '../../validator/video';
import {
  getPagination,
  getPagingData,
  getResponse,
  getServerError,
  getValidationError,
} from '../../helpers/api';
import {
  CATEGORY_NOT_FOUND,
  USER_NOT_FOUND,
  VIDEO_CREATED_SUCCESS,
  VIDEO_NOT_FOUND,
  VIDEO_UPDATED_SUCCESS,
} from '../constants/message';
import { generateSlug, getCategoryById, getVideoById, getVideoBySlug } from '../../helpers/video';

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

      const getVideo = await getVideoById(res, newVideo.get().id as number);

      // TODO: should send email/notification to the video owner
      // TODO: send email/notification to all user in the app

      return this.videoResponse(res, getVideo.get(), CREATED, VIDEO_CREATED_SUCCESS);
    } catch (error) {
      getServerError(res, error.message);
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
      const video = await getVideoBySlug(res, slug);
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

      return this.videoResponse(res, getVideo.get(), OK, VIDEO_UPDATED_SUCCESS);
    } catch (error) {
      getServerError(res, error.message);
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
      getServerError(res, error.message);
    }
  };

  /**
   * helper to send video info
   * @param res Response
   * @param data Object
   * @param status number
   * @param message string
   * @returns
   */
  videoResponse = (res: Response, data: IVideo, status: number, message?: string) => {
    return getResponse(res, status, {
      message,
      data,
    });
  };
}

const adminVideoCtrl = new AdminVideo();
export default adminVideoCtrl;
