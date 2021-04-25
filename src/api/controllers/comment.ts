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

      const comment = {
        body,
        userId,
        articleId: article.get().id,
      };

      const result = await db.Comment.create(comment, {
        include: [
          {
            as: 'user',
            model: db.User,
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
          },
        ],
      });

      return contentResponse(res, result, CREATED, COMMENT_CREATED_SUCCESS);
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  // /**
  //  * controller to get all article
  //  * @param req Request
  //  * @param res Response
  //  */
  // getAll = async (req: Request, res: Response): Promise<any> => {
  //   const { limit = 20, offset = 0 } = req.query;

  //   try {
  //     const { count, rows: articles } = await getAllArticle(res, Number(limit), Number(offset));
  //     return getResponse(res, OK, {
  //       data: { count, articles },
  //     });
  //   } catch (error) {
  //     return getServerError(res, error.message);
  //   }
  // };

  // /**
  //  * controller to get a single article using slug
  //  * @description only returns active articles
  //  * @param req Request
  //  * @param res Response
  //  */
  // get = async (req: Request, res: Response): Promise<any> => {
  //   const { slug } = req.params;

  //   try {
  //     const article = await getArticleBySlug(res, slug as string);

  //     if (!article) {
  //       return getResponse(res, NOT_FOUND, {
  //         message: ARTICLE_NOT_FOUND,
  //       });
  //     }

  //     return contentResponse(res, article, OK);
  //   } catch (error) {
  //     return getServerError(res, error.message);
  //   }
  // };
}

const commentCtrl = new Comment();
export default commentCtrl;
