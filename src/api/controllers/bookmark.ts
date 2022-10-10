import { Request, Response } from 'express';
import { CONFLICT, CREATED, NOT_FOUND, OK } from 'http-status';
import {
  ARTICLE_ALREADY_BOOKMARKED,
  ARTICLE_BOOKMARKED_SUCCESS,
  ARTICLE_NOT_BOOKMARKED,
  ARTICLE_NOT_FOUND,
  ARTICLE_UNBOOKMARKED_SUCCESS,
} from '../../constants/message';
import db from '../../db/models';
import { contentResponse, getResponse, getServerError } from '../../helpers/api';
import { getArticleBySlug } from '../../helpers/article';
import getAllBookmarks, { getBookmarkByUserId } from '../../helpers/bookmark';
import { IJwtPayload } from '../../interfaces/api';

export class BookmarkArticle {
  /**
   * controller to bookmark an article
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

      const bookmark = await db.Bookmark.findOne({
        where: {
          userId,
          articleId: article?.get().id,
        },
      });

      if (bookmark) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_ALREADY_BOOKMARKED,
          message: req.t('ARTICLE_ALREADY_BOOKMARKED'),
        });
      }

      await db.Bookmark.create({
        userId,
        articleId: article?.get().id,
      });

      const newArticle = await getArticleBySlug(res, slug);

      return contentResponse(
        res,
        newArticle,
        CREATED,
        req.t('ARTICLE_BOOKMARKED_SUCCESS'),
        ARTICLE_BOOKMARKED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to unbookmark an article
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

      const bookmark = await db.Bookmark.findOne({
        where: {
          userId,
          articleId: article?.get().id,
        },
      });

      if (!bookmark) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_NOT_BOOKMARKED,
          message: req.t('ARTICLE_NOT_BOOKMARKED'),
        });
      }

      await db.Bookmark.destroy({
        where: {
          userId,
          articleId: article?.get().id,
        },
      });

      const result = await getArticleBySlug(res, slug as string);
      return contentResponse(
        res,
        result,
        OK,
        req.t('ARTICLE_UNBOOKMARKED_SUCCESS'),
        ARTICLE_UNBOOKMARKED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all articles that a user bookmarked
   * @param req Request
   * @param res Response
   */
  getBookmarkByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { id: userId } = req.user as IJwtPayload;

    try {
      const bookmarks = await getBookmarkByUserId(res, userId);
      return contentResponse(res, bookmarks, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get article bookmarked by a user.
   * @description to check if the user has already rated an article
   * @param req Request
   * @param res Response
   */
  getSingleArticleUserBookmark = async (req: Request, res: Response): Promise<Response> => {
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

      const data = await db.Bookmark.findAll({
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
   * controller to get and count article bookmarks
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
      const bookmarks = await getAllBookmarks(res, article?.get().id);
      return contentResponse(res, bookmarks, OK);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const bookmarkArticleCtrl = new BookmarkArticle();
export default bookmarkArticleCtrl;
