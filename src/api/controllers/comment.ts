import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { NOT_FOUND, CREATED } from 'http-status';
import { ARTICLE_NOT_FOUND, COMMENT_CREATED_SUCCESS } from '../../constants/message';
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
import CommentValidator from '../../validator/comment';

export class Comment {
  /**
   * controller to create comment for an article
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<any> => {
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
          message: ARTICLE_NOT_FOUND,
        });
      }

      const result = await db.Comment.create({
        body,
        userId,
        articleId: article.get().id,
      });

      const comment = await getCommentById(res, result.get().id as number);

      return contentResponse(res, comment, CREATED, COMMENT_CREATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all comments for an article
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<any> => {
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
}

const commentCtrl = new Comment();
export default commentCtrl;
