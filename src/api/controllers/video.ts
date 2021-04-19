/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import { IVideo } from '../../interfaces/model';
import { getResponse, getServerError } from '../../helpers/api';
import { VIDEO_NOT_FOUND } from '../constants/message';
import { getAllVideo, getVideoBySlug } from '../../helpers/video';

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
      getServerError(res, error.message);
    }
  };

  /**
   * controller to get a single video using slug
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

      return this.videoResponse(res, video, OK);
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

const videoCtrl = new Video();
export default videoCtrl;
