/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { NOT_FOUND, OK } from 'http-status';
import { toLower } from 'lodash';
import { ARTICLE_NOT_FOUND, ARTICLE_TAGS_NOT_FOUND } from '../../constants/message';
import db from '../../db/models';
import { contentResponse, getResponse, getServerError } from '../../helpers/api';
import { getAllArticle, getArticleBySlug } from '../../helpers/article';
import { IUnknownObject } from '../../interfaces/unknownObject';

export class Article {
  /**
   * controller to get all article
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 20, offset = 0 } = req.query;
    try {
      const { count, rows: articles } = await getAllArticle(res, Number(limit), Number(offset));
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
   * //TODO: should add the query string for search (title, summary, body, etc.) and also search the keyword in the list of tags
   * controller to search all articles by tags
   * @param req Request
   * @param res Response
   */
  getByTags = async (req: Request, res: Response): Promise<Response> => {
    const { limit = 20, offset = 0, tag } = req.query;
    const formatted = toLower(String(tag));
    const where = tag
      ? {
          tags: {
            [Op.contains]: [formatted],
          },
        }
      : {};
    try {
      const { count, rows: articles } = await db.Article.findAndCountAll({
        where,
        distinct: true,
        limit: Number(limit),
        offset: Number(offset),
        order: [['createdAt', 'DESC']],
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
}

const articleCtrl = new Article();
export default articleCtrl;
