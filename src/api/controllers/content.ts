import { Request, Response } from 'express';
import { isEmpty, toLower } from 'lodash';
import { literal, Op } from 'sequelize';
import { OK } from 'http-status';
import { getPagination, getResponse, getServerError } from '../../helpers/api';
import db from '../../db/models';

export class Article {
  /**
   * controller to search all content
   * @param req Request
   * @param res Response
   */
  search = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 20, page = 1, q, tag } = req.query;
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    const isTag = !isEmpty(tag);
    const isSearch = !isEmpty(q);

    const whereActive = { active: true };

    const whereSearchVideos = isSearch ? { title: { [Op.iLike]: `%${q}%` } } : undefined;
    const whereSearchArticles = isSearch
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${q}%` } },
            { summary: { [Op.iLike]: `%${q}%` } },
            { body: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : undefined;

    const whereTag = isTag
      ? {
          tags: {
            [Op.contains]: [toLower(String(tag))],
          },
        }
      : undefined;

    try {
      const { count: countArticles, rows: articles } = await db.Article.findAndCountAll({
        offset,
        limit: size,
        distinct: true,
        order: [['createdAt', 'DESC']],
        where: {
          [Op.and]: [{ ...whereSearchArticles, ...whereTag, ...whereActive }],
        },
        attributes: {
          include: [
            [
              literal('(SELECT COUNT(*) FROM "like" WHERE "like"."articleId" = "Article"."id")'),
              'likesCount',
            ],
            [
              literal(
                '(SELECT COUNT(*) FROM "comment" WHERE "comment"."articleId" = "Article"."id")',
              ),
              'commentsCount',
            ],
            [
              literal(
                '(SELECT COUNT(*) FROM "bookmark" WHERE "bookmark"."articleId" = "Article"."id")',
              ),
              'bookmarksCount',
            ],
          ],
        },
        include: [
          {
            as: 'user',
            model: db.User,
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
          },
          {
            as: 'like',
            model: db.Like,
          },
          {
            as: 'bookmark',
            model: db.Bookmark,
          },
          {
            as: 'comment',
            model: db.Comment,
          },
        ],
      });

      const { count: countVideos, rows: videos } = await db.Video.findAndCountAll({
        offset,
        limit: size,
        distinct: true,
        order: [['createdAt', 'DESC']],
        where: {
          [Op.and]: [{ ...whereSearchVideos, ...whereTag, ...whereActive }],
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
        data: {
          articles: { count: countArticles, articles },
          videos: { count: countVideos, videos },
        },
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const contentCtrl = new Article();
export default contentCtrl;
