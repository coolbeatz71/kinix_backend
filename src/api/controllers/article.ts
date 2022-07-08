/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import { ARTICLE_NOT_FOUND, ARTICLE_TAGS_NOT_FOUND } from '../../constants/message';
import db from '../../db/models';
import { contentResponse, getResponse, getServerError } from '../../helpers/api';
import { getAllArticle, getArticleBySlug } from '../../helpers/article';

export class Article {
  /**
   * controller to get all article
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<any> => {
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
  get = async (req: Request, res: Response): Promise<any> => {
    const { slug } = req.params;

    try {
      const article = await getArticleBySlug(res, slug as string);

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          message: ARTICLE_NOT_FOUND,
        });
      }

      return contentResponse(res, article, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all the article tags
   * @param req Request
   * @param res Response
   */
  getAllTags = async (_req: Request, res: Response): Promise<any> => {
    try {
      const data = await db.Article.findAll({
        attributes: ['tags'],
      });

      if (!data) {
        return getResponse(res, NOT_FOUND, {
          message: ARTICLE_TAGS_NOT_FOUND,
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

const articleCtrl = new Article();
export default articleCtrl;
