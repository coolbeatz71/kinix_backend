/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { literal, Op } from 'sequelize';
import { isEmpty, toLower } from 'lodash';
import { NOT_FOUND, OK } from 'http-status';
import { ARTICLE_NOT_FOUND, ARTICLE_TAGS_NOT_FOUND } from '../../constants/message';
import db from '../../db/models';
import { contentResponse, getPagination, getResponse, getServerError } from '../../helpers/api';
import { getArticleBySlug } from '../../helpers/article';
import { IUnknownObject } from '../../interfaces/unknownObject';

export class Article {
  /**
   * controller to get all article
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 20, page = 1, search, tag } = req.query;
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    const isTag = !isEmpty(tag);
    const isSearch = !isEmpty(search);

    const whereActive = { active: true };
    const whereSearch = isSearch
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { summary: { [Op.iLike]: `%${search}%` } },
            { body: { [Op.iLike]: `%${search}%` } },
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
      const { count, rows: articles } = await db.Article.findAndCountAll({
        offset,
        limit: size,
        order: [['createdAt', 'DESC']],
        where: {
          [Op.and]: [{ ...whereSearch, ...whereTag, ...whereActive }],
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
      return getResponse(res, OK, {
        data: { count, articles },
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get a single article using slug
   * @description only returns active articles
   * @param req Request
   * @param res Response
   */
  get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    try {
      const article = await getArticleBySlug(res, slug as string);

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      return contentResponse(res, article, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to related articles by tags
   * @description only returns active articles
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
      const data = await db.Article.findAll({
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
   * controller to get all the article tags
   * @param req Request
   * @param res Response
   */
  getAllTags = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await db.Article.findAll({
        attributes: ['tags'],
      });

      if (!data) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_TAGS_NOT_FOUND,
          message: req.t('ARTICLE_TAGS_NOT_FOUND'),
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

  /**
   * controller to get featured articles
   * @param req Request
   * @param res Response
   */
  getFeatured = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 5 } = req.query;
    try {
      const data = await db.Article.findAll({
        limit: Number(limit),
        order: [['updatedAt', 'DESC']],
        where: {
          featured: true,
        },
      });

      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get popular articles
   * @param req Request
   * @param res Response
   */
  getPopular = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 12 } = req.query;
    try {
      const data = await db.Article.findAll({
        limit: Number(limit),
        where: { active: true },
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
          ],
        },
        order: [
          [literal('"likesCount"'), 'DESC'],
          [literal('"commentsCount"'), 'DESC'],
        ],
      });

      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const articleCtrl = new Article();
export default articleCtrl;
