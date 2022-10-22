/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import { getResponse, getServerError, contentResponse } from '../../helpers/api';
import { VIDEO_NOT_FOUND, VIDEO_SHARED_SUCCESS } from '../../constants/message';
import { IJwtPayload } from '../../interfaces/api';
import { getVideoById, getVideoBySlug } from '../../helpers/video';
import db from '../../db/models';
import getSharesByUserId from '../../helpers/share';

export class ShareVideo {
  /**
   * update video after create/update sharing
   * @param res Response
   * @param videoId number
   */
  private updateVideo = async (res: Response, videoId: number): Promise<any> => {
    try {
      await db.Video.update(
        {
          shared: true,
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
   * controller to share a video
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
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

      await db.Share.findOrCreate({
        where: {
          userId,
          videoId: video?.get().id,
        },
      });

      const share = await this.updateVideo(res, video?.get().id);
      return contentResponse(res, share, OK, req.t('VIDEO_SHARED_SUCCESS'), VIDEO_SHARED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get and count video shares
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    try {
      const video = await getVideoBySlug(res, slug);
      if (!video) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_NOT_FOUND,
          message: req.t('VIDEO_NOT_FOUND'),
        });
      }
      const shares = await db.Share.findAndCountAll({
        distinct: true,
        where: { videoId: video.get().id },
      });
      return contentResponse(res, shares, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all videos shared by a user
   * @param req Request
   * @param res Response
   */
  getShareByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { id: userId } = req.user as IJwtPayload;

    try {
      const shares = await getSharesByUserId(res, userId);
      return contentResponse(res, shares, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const shareVideoCtrl = new ShareVideo();
export default shareVideoCtrl;
