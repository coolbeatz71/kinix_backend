/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CREATED } from 'http-status';
import db from '../../db/models';
import { getResponse, getServerError, getValidationError } from '../../helpers/api';
import { getUserById } from '../../helpers/user';
import { generateSlug, getCategoryById } from '../../helpers/video';
import VideoValidator from '../../validator/video';
import { IVideo } from '../../interfaces/model';
import { VIDEO_CREATED_SUCCESS } from '../constants/message';

export class Video {
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

      await getCategoryById(res, categoryId);
      await getUserById(res, userId);

      const newVideo = await db.Video.create({
        title,
        link,
        slug,
        tags,
        categoryId,
        userId,
      });

      // TODO: should send email/notification the user
      // TODO: send email/notification to all user in the app

      return this.videoResponse(res, newVideo.get(), CREATED, VIDEO_CREATED_SUCCESS);
    } catch (error) {
      getServerError(res, error.message);
    }
  };

  /**
   * helper to send video info
   * @param res Response
   * @param article Object
   * @param status number
   * @param message string
   * @returns
   */
  videoResponse = (res: Response, video: IVideo, status: number, message: string) => {
    return getResponse(res, status, {
      message,
      data: {
        id: video.id,
        slug: video.slug,
        title: video.title,
        link: video.link,
        tags: video.tags,
        active: video.active,
        shared: video.shared,
        shareCount: video.shareCount,
        userId: video.userId,
        categoryId: video.categoryId,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      },
    });
  };
}

const videoCtrl = new Video();
export default videoCtrl;
