/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import { contentResponse, getResponse, getServerError } from '../../helpers/api';
import { VIDEO_NOT_FOUND } from '../../constants/message';
import {
  getAllVideo,
  getVideoByCategory,
  getVideoBySlug,
  getVideoDiscovery,
  getVideoPopular,
} from '../../helpers/video';
import ECategory from '../../interfaces/category';
import db from '../../db/models';

export class Video {
  /**
   * controller to get all video
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<any> => {
    const { limit = 20, offset = 0 } = req.query;

    try {
      const { count, rows: videos } = await getAllVideo(res, Number(limit), Number(offset));
      return getResponse(res, OK, {
        data: { count, videos },
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get a single video using slug
   * @description only returns active videos
   * @param req Request
   * @param res Response
   */
  get = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;

    try {
      const video = await getVideoBySlug(res, slug as string);

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

  /**
   * controller to get video feed
   * @param req Request
   * @param res Response
   */
  getFeed = async (_req: Request, res: Response): Promise<any> => {
    try {
      // get discovery by category
      const musicVideoDiscovery = await getVideoDiscovery(res, ECategory.MUSIC_VIDEO);
      const podcastDiscovery = await getVideoDiscovery(res, ECategory.PODCAST);
      const interviewDiscovery = await getVideoDiscovery(res, ECategory.INTERVIEW);
      const flexBeatzDiscovery = await getVideoDiscovery(res, ECategory.FLEXBEATZ);
      const leFocusDiscovery = await getVideoDiscovery(res, ECategory.LEFOCUS);

      const discovery = [
        ...musicVideoDiscovery,
        ...podcastDiscovery,
        ...interviewDiscovery,
        ...flexBeatzDiscovery,
        ...leFocusDiscovery,
      ];

      // get popular videos;
      const popular = await getVideoPopular(res);

      // get video per category
      const musicVideo = await getVideoByCategory(res, ECategory.MUSIC_VIDEO);
      const podcast = await getVideoByCategory(res, ECategory.PODCAST);
      const interview = await getVideoByCategory(res, ECategory.INTERVIEW);
      const flexBeatz = await getVideoByCategory(res, ECategory.FLEXBEATZ);
      const leFocus = await getVideoByCategory(res, ECategory.LEFOCUS);

      const data = {
        discovery,
        popular,
        musicVideo,
        podcast,
        interview,
        flexBeatz,
        leFocus,
      };

      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  getCategories = async (_req: Request, res: Response): Promise<any> => {
    try {
      const data = await db.Category.findAll();
      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const videoCtrl = new Video();
export default videoCtrl;
