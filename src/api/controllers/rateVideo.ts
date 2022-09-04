/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CREATED, NOT_FOUND, OK } from 'http-status';
import {
  contentResponse,
  getResponse,
  getServerError,
  getValidationError,
} from '../../helpers/api';
import {
  VIDEO_NOT_FOUND,
  VIDEO_RATE_CREATED_SUCCESS,
  VIDEO_RATE_UPDATED_SUCCESS,
} from '../../constants/message';
import { IJwtPayload } from '../../interfaces/api';
import RateVideoValidator from '../../validator/rate';
import { calcVideoAVGRate, getVideoById, getVideoBySlug } from '../../helpers/video';
import db from '../../db/models';

export class RateVideo {
  /**
   * update video after create/update rate
   * @param res Response
   * @param videoId number
   */
  private updateVideo = async (res: Response, videoId: number): Promise<any> => {
    try {
      const average = await calcVideoAVGRate(res, videoId);
      const { sumRate, totalRaters } = average[0].get();
      const avgRate = sumRate / totalRaters;
      await db.Video.update(
        {
          avgRate,
          totalRaters,
        },
        {
          where: { id: videoId },
        },
      );

      const video = await getVideoById(res, videoId);
      return video;
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to rate a video
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const { count } = req.body;
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    await new RateVideoValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const video = await getVideoBySlug(res, slug);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_NOT_FOUND,
          message: req.t('VIDEO_NOT_FOUND'),
        });
      }

      const ratedVideo = await db.Rate.findOne({
        where: {
          userId,
          videoId: video.get().id,
        },
      });

      if (ratedVideo) {
        await ratedVideo.update({
          count,
        });

        const updated = await this.updateVideo(res, video.get().id);
        return contentResponse(
          res,
          updated,
          OK,
          req.t('VIDEO_RATE_UPDATED_SUCCESS'),
          VIDEO_RATE_UPDATED_SUCCESS,
        );
      }

      await db.Rate.create({
        count,
        userId,
        videoId: video.get().id,
      });

      const created = await this.updateVideo(res, video.get().id);
      return contentResponse(
        res,
        created,
        CREATED,
        req.t('VIDEO_RATE_CREATED_SUCCESS'),
        VIDEO_RATE_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get video rated by a user.
   * @description to check if the user has already rated a video
   * @param req Request
   * @param res Response
   */
  getSingleVideoUserRatings = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    try {
      const video = await getVideoBySlug(res, slug);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_NOT_FOUND,
          message: req.t('VIDEO_NOT_FOUND'),
        });
      }

      const data = await db.Rate.findAll({
        where: {
          userId,
          videoId: video.get().id,
        },
      });

      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const rateVideoCtrl = new RateVideo();
export default rateVideoCtrl;
