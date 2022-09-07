import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { NOT_FOUND, CREATED, UNAUTHORIZED, OK } from 'http-status';
import {
  COMMENT_NOT_FOUND,
  ARTICLE_NOT_FOUND,
  COMMENT_NOT_OWNER,
  COMMENT_DELETED_SUCCESS,
  COMMENT_CREATED_SUCCESS,
  COMMENT_UPDATED_SUCCESS,
} from '../../constants/message';
import db from '../../db/models';
import {
  contentResponse,
  getResponse,
  getServerError,
  getValidationError,
} from '../../helpers/api';
import { getArticleBySlug } from '../../helpers/article';
import { getAllComment, getCommentById } from '../../helpers/comment';
import { IJwtPayload } from '../../interfaces/api';
import ERole from '../../interfaces/role';
import CommentValidator from '../../validator/comment';

export class Comment {
  /**
   * controller to create comment for an article
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;
    const { body } = req.body;

    await new CommentValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const article = await getArticleBySlug(res, slug, true);
      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      const result = await db.Comment.create({
        body,
        userId,
        articleId: article?.get().id,
      });

      const comment = await getCommentById(res, result?.get().id as number);

      return contentResponse(
        res,
        comment,
        CREATED,
        req.t('COMMENT_CREATED_SUCCESS'),
        COMMENT_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all comments for an article
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { limit = 20, offset = 0, body, userName } = req.query;

    try {
      const comments = await getAllComment(
        res,
        slug,
        Number(limit),
        Number(offset),
        body as string,
        userName as string,
      );

      return comments;
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to delete a comment
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    const { slug, id } = req.params;
    const { id: userId, role } = req.user as IJwtPayload;

    try {
      const article = await getArticleBySlug(res, slug);
      const comment = await getCommentById(res, Number(id));

      if (!comment) {
        return getResponse(res, NOT_FOUND, {
          code: COMMENT_NOT_FOUND,
          message: req.t('COMMENT_NOT_FOUND'),
        });
      }

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      if (![ERole.ADMIN, ERole.SUPER_ADMIN].includes(role) && comment?.get().userId !== userId) {
        return getResponse(res, UNAUTHORIZED, {
          code: COMMENT_NOT_OWNER,
          message: req.t('COMMENT_NOT_OWNER'),
        });
      }

      const result = await db.Comment.destroy({
        where: { id, articleId: article?.get().id },
      });

      if (result > 0) {
        return getResponse(res, OK, {
          code: COMMENT_DELETED_SUCCESS,
          message: req.t('COMMENT_DELETED_SUCCESS'),
        });
      }

      return getResponse(res, NOT_FOUND, {
        code: COMMENT_NOT_FOUND,
        message: req.t('COMMENT_NOT_FOUND'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update a comment
   * @param req Request
   * @param res Response
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req.body;
    const { slug, id } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    await new CommentValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const article = await getArticleBySlug(res, slug);
      const comment = await getCommentById(res, Number(id));

      if (!comment) {
        return getResponse(res, NOT_FOUND, {
          code: COMMENT_NOT_FOUND,
          message: req.t('COMMENT_NOT_FOUND'),
        });
      }

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      if (comment?.get().userId !== userId) {
        return getResponse(res, UNAUTHORIZED, {
          code: COMMENT_NOT_OWNER,
          message: req.t('COMMENT_NOT_OWNER'),
        });
      }

      const update = await db.Comment.update(
        { body },
        {
          returning: true,
          where: { id, articleId: article?.get().id },
        },
      );

      return contentResponse(
        res,
        update[1][0],
        OK,
        req.t('COMMENT_UPDATED_SUCCESS'),
        COMMENT_UPDATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const commentCtrl = new Comment();
export default commentCtrl;
