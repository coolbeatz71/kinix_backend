import { Request, Response } from 'express';
import { CONFLICT, CREATED, NOT_FOUND, OK } from 'http-status';
import {
  ARTICLE_ALREADY_LIKED,
  ARTICLE_LIKED_SUCCESS,
  ARTICLE_NOT_FOUND,
  ARTICLE_NOT_LIKED,
  ARTICLE_UNLIKED_SUCCESS,
} from '../../constants/message';
import db from '../../db/models';
import { contentResponse, getResponse, getServerError } from '../../helpers/api';
import { getArticleBySlug } from '../../helpers/article';
import getAllLikes, { getLikeByUserId } from '../../helpers/like';
import { IJwtPayload } from '../../interfaces/api';

export class LikeArticle {
  /**
   * controller to like an article
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    try {
      const article = await getArticleBySlug(res, slug);
      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      const like = await db.Like.findOne({
        where: {
          userId,
          articleId: article?.get().id,
        },
      });

      if (like) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_ALREADY_LIKED,
          message: req.t('ARTICLE_ALREADY_LIKED'),
        });
      }

      await db.Like.create({
        userId,
        articleId: article?.get().id,
      });
      // updated liked
      const update = await db.Article.update(
        {
          liked: true,
        },
        {
          where: { slug },
          returning: true,
        },
      );

      return contentResponse(
        res,
        update[1][0],
        CREATED,
        req.t('ARTICLE_LIKED_SUCCESS'),
        ARTICLE_LIKED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to unlike an article
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    try {
      const article = await getArticleBySlug(res, slug);
      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      const like = await db.Like.findOne({
        where: {
          userId,
          articleId: article?.get().id,
        },
      });

      if (!like) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_NOT_LIKED,
          message: req.t('ARTICLE_NOT_LIKED'),
        });
      }

      await db.Like.destroy({
        where: {
          userId,
          articleId: article?.get().id,
        },
      });
      // updated liked
      const result = await getArticleBySlug(res, slug as string);
      const update = await db.Article.update(
        {
          liked: result?.get().like?.length > 0,
        },
        {
          where: { slug },
          returning: true,
        },
      );

      return contentResponse(
        res,
        update[1][0],
        OK,
        req.t('ARTICLE_UNLIKED_SUCCESS'),
        ARTICLE_UNLIKED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all articles that a user liked
   * @param req Request
   * @param res Response
   */
  getLikeByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { id: userId } = req.user as IJwtPayload;

    try {
      const likes = await getLikeByUserId(res, userId);
      return contentResponse(res, likes, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get article rated by a user.
   * @description to check if the user has already rated an article
   * @param req Request
   * @param res Response
   */
  getSingleVideoUserLike = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    try {
      const article = await getArticleBySlug(res, slug);
      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      const data = await db.Like.findAll({
        where: {
          userId,
          articleId: article?.get().id,
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
   * controller to get and count article likes
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    try {
      const article = await getArticleBySlug(res, slug);
      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }
      const likes = await getAllLikes(res, article?.get().id);
      return contentResponse(res, likes, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const likeArticleCtrl = new LikeArticle();
export default likeArticleCtrl;
