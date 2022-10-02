/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { literal, Op } from 'sequelize';
import { NOT_FOUND, OK } from 'http-status';
import { isEmpty, toLower } from 'lodash';
import { contentResponse, getPagination, getResponse, getServerError } from '../../helpers/api';
import { VIDEO_NOT_FOUND, VIDEO_TAGS_NOT_FOUND } from '../../constants/message';
import {
  getCategoryByName,
  getVideoByCategory,
  getVideoBySlug,
  getVideoDiscovery,
  getVideoPopular,
} from '../../helpers/video';
import ECategory from '../../interfaces/category';
import db from '../../db/models';
import { IUnknownObject } from '../../interfaces/unknownObject';

export class Video {
  /**
   * controller to get all video
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 20, page = 1, search, tag, category } = req.query;
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    const isTag = !isEmpty(tag);
    const isSearch = !isEmpty(search);
    const isCategory = !isEmpty(category);

    const values = Object.values(ECategory);
    const isCategoryValid = values.includes(String(category).toUpperCase() as unknown as ECategory);

    const cat = (await getCategoryByName(res, String(category).toUpperCase())) || null;

    const whereActive = { active: true };
    const whereCategory = isCategory && isCategoryValid ? { categoryId: cat?.get().id } : undefined;
    const whereSearch = isSearch ? { title: { [Op.iLike]: `%${search}%` } } : undefined;
    const whereTag = isTag
      ? {
          tags: {
            [Op.contains]: [toLower(String(tag))],
          },
        }
      : undefined;

    try {
      const { count, rows: videos } = await db.Video.findAndCountAll({
        offset,
        limit: size,
        order: [['createdAt', 'DESC']],
        where: {
          [Op.and]: [{ ...whereSearch, ...whereTag, ...whereCategory, ...whereActive }],
        },
        attributes: {
          include: [
            [
              literal('(SELECT COUNT(*) FROM "share" WHERE "share"."videoId" = "Video"."id")'),
              'sharesCount',
            ],
            [
              literal(
                '(SELECT COUNT(*) FROM "playlist" WHERE "playlist"."videoId" = "Video"."id")',
              ),
              'playlistsCount',
            ],
          ],
        },
        include: [
          {
            as: 'category',
            model: db.Category,
            attributes: ['id', 'name'],
          },
          {
            as: 'user',
            model: db.User,
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
          },
          {
            as: 'rate',
            model: db.Rate,
          },
          {
            as: 'share',
            model: db.Share,
          },
        ],
      });

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
  get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    try {
      const video = await getVideoBySlug(res, slug as string);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_NOT_FOUND,
          message: req.t('VIDEO_NOT_FOUND'),
        });
      }

      return contentResponse(res, video, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to related videos by tags
   * @description only returns active videos
   * @param req Request
   * @param res Response
   */
  getRelated = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { limit = 5, tags } = req.query;
    const parsedTags: string[] = String(tags)?.split(',') || [];

    const tagList: Array<IUnknownObject> = [];
    parsedTags.forEach((tag) =>
      tagList.push({
        [Op.contains]: [tag],
      }),
    );

    try {
      const data = await db.Video.findAll({
        limit: Number(limit),
        order: [['createdAt', 'DESC']],
        where: {
          active: true,
          tags: {
            [Op.or]: tagList,
          },
          slug: {
            [Op.ne]: slug,
          },
        },
        include: [
          {
            as: 'user',
            model: db.User,
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
          },
        ],
      });

      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get video feed
   * @param req Request
   * @param res Response
   */
  getFeed = async (_req: Request, res: Response): Promise<Response> => {
    try {
      // get discovery by category
      const podcastDiscovery = await getVideoDiscovery(res, ECategory.PODCAST);
      const leFocusDiscovery = await getVideoDiscovery(res, ECategory.LEFOCUS);
      const interviewDiscovery = await getVideoDiscovery(res, ECategory.INTERVIEW);
      const flexBeatzDiscovery = await getVideoDiscovery(res, ECategory.FLEXBEATZ);
      const musicVideoDiscovery = await getVideoDiscovery(res, ECategory.MUSIC_VIDEO);

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
      const podcast = await getVideoByCategory(res, ECategory.PODCAST);
      const leFocus = await getVideoByCategory(res, ECategory.LEFOCUS);
      const interview = await getVideoByCategory(res, ECategory.INTERVIEW);
      const flexBeatz = await getVideoByCategory(res, ECategory.FLEXBEATZ);
      const musicVideo = await getVideoByCategory(res, ECategory.MUSIC_VIDEO);

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

  /**
   * controller to get all the video categories
   * @param req Request
   * @param res Response
   */
  getAllCategories = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const data = await db.Category.findAll();
      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all the video tags
   * @param req Request
   * @param res Response
   */
  getAllTags = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await db.Video.findAll({
        attributes: ['tags'],
      });

      if (!data) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_TAGS_NOT_FOUND,
          message: req.t('VIDEO_TAGS_NOT_FOUND'),
        });
      }

      const tags = data.map((dt) => dt.tags).flat();
      const formatted = tags?.map((tag) => tag?.toLowerCase());
      const set = new Set(formatted);

      return getResponse(res, OK, {
        data: [...set],
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const videoCtrl = new Video();
export default videoCtrl;
