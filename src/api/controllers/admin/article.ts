/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CONFLICT, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } from 'http-status';
import { literal, Op } from 'sequelize';
import { isEmpty, lowerCase } from 'lodash';
import db from '../../../db/models';
import {
  comparePassword,
  contentResponse,
  generateSlug,
  getPagination,
  getPagingData,
  getResponse,
  getServerError,
  getValidationError,
} from '../../../helpers/api';
import {
  ARTICLE_ALREADY_ACTIVE,
  ARTICLE_ALREADY_INACTIVE,
  ARTICLE_APPROVED_SUCCESS,
  ARTICLE_CREATED_SUCCESS,
  ARTICLE_DELETED_SUCCESS,
  ARTICLE_DISABLED_SUCCESS,
  ARTICLE_EXIST,
  ARTICLE_NOT_FOUND,
  ARTICLE_UPDATED_SUCCESS,
  PASSWORD_INVALID,
  PASSWORD_REQUIRED,
  USERNAME_EMAIL_INVALID,
} from '../../../constants/message';
import {
  getArticleById,
  getArticleBySlug,
  getArticleByTitle,
  getReadTime,
} from '../../../helpers/article';
import ArticleValidator from '../../../validator/article';
import { EnumStatus, IJwtPayload } from '../../../interfaces/api';

export class AdminArticle {
  /**
   * controller to create an article
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const { title, summary, body, images, tags } = req.body;
    const { id: userId } = req.user as IJwtPayload;

    await new ArticleValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const slug = await generateSlug(title);
      const reads = getReadTime(title, summary, body);
      const article = await getArticleByTitle(res, title, true);

      if (article) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_EXIST,
          message: req.t('ARTICLE_EXIST'),
        });
      }

      const newArticle = await db.Article.create({
        slug,
        title,
        summary,
        body,
        images,
        tags,
        userId,
        reads,
      });

      const getArticle = await getArticleById(res, newArticle?.get().id as number, true);

      // TODO: send email/notification to all user in the app

      return contentResponse(
        res,
        getArticle?.get(),
        CREATED,
        req.t('ARTICLE_CREATED_SUCCESS'),
        ARTICLE_CREATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to update an article
   * @param req Request
   * @param res Response
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;
    const { title, summary, body, images, tags } = req.body;

    await new ArticleValidator(req).create();
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

      const newSlug = await generateSlug(title);
      const reads = getReadTime(title, summary, body);

      await db.Article.update(
        {
          slug: newSlug,
          title,
          summary,
          body,
          images,
          tags,
          userId,
          reads,
        },
        { where: { id: article?.get().id } },
      );

      const getArticle = await getArticleBySlug(res, newSlug, true);

      return contentResponse(
        res,
        getArticle?.get(),
        OK,
        req.t('ARTICLE_UPDATED_SUCCESS'),
        ARTICLE_UPDATED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to approve an article
   * @param req Request
   * @param res Response
   */
  approve = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        code: PASSWORD_REQUIRED,
        message: req.t('PASSWORD_REQUIRED'),
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, admin?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      const article = await getArticleBySlug(res, slug, true);

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      if (article?.get().active) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_ALREADY_ACTIVE,
          message: req.t('ARTICLE_ALREADY_ACTIVE'),
        });
      }

      const update = await db.Article.update(
        {
          active: true,
        },
        { where: { id: article?.get().id }, returning: true },
      );

      return contentResponse(
        res,
        update[1][0],
        OK,
        req.t('ARTICLE_APPROVED_SUCCESS'),
        ARTICLE_APPROVED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to disable an article
   * @param req Request
   * @param res Response
   */
  disable = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        code: PASSWORD_REQUIRED,
        message: req.t('PASSWORD_REQUIRED'),
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, admin?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      const article = await getArticleBySlug(res, slug, true);

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      if (!article?.get().active) {
        return getResponse(res, CONFLICT, {
          code: ARTICLE_ALREADY_INACTIVE,
          message: req.t('ARTICLE_ALREADY_INACTIVE'),
        });
      }

      const update = await db.Article.update(
        {
          active: false,
        },
        { where: { id: article?.get().id }, returning: true },
      );

      return contentResponse(
        res,
        update[1][0],
        OK,
        req.t('ARTICLE_DISABLED_SUCCESS'),
        ARTICLE_DISABLED_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to delete an article from the DB
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { password } = req.body;
    const { email } = req.user as IJwtPayload;

    if (!password) {
      return getResponse(res, UNAUTHORIZED, {
        code: PASSWORD_REQUIRED,
        message: req.t('PASSWORD_REQUIRED'),
      });
    }

    try {
      const admin = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        return getResponse(res, UNAUTHORIZED, {
          code: USERNAME_EMAIL_INVALID,
          message: req.t('USERNAME_EMAIL_INVALID'),
        });
      }

      const isPasswordValid = comparePassword(password, admin?.get().password);

      if (!isPasswordValid) {
        return getResponse(res, FORBIDDEN, {
          code: PASSWORD_INVALID,
          message: req.t('PASSWORD_INVALID'),
        });
      }

      const article = await getArticleBySlug(res, slug, true);

      if (!article) {
        return getResponse(res, NOT_FOUND, {
          code: ARTICLE_NOT_FOUND,
          message: req.t('ARTICLE_NOT_FOUND'),
        });
      }

      await db.Article.destroy({ where: { id: article?.get().id } });
      return getResponse(res, OK, {
        code: ARTICLE_DELETED_SUCCESS,
        message: req.t('ARTICLE_DELETED_SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all article or search article by title
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 20, search, status } = req.query;
    const isStatus = !isEmpty(status);
    const isActive = status === lowerCase(EnumStatus.ACTIVE);
    const { limit: size, offset } = getPagination(Number(page), Number(limit));

    const whereStatus = isStatus
      ? {
          active: isActive,
        }
      : undefined;
    const whereSearch = search
      ? {
          [Op.or]: [
            {
              title: { [Op.iLike]: `%${search}%` },
            },
            {
              summary: { [Op.iLike]: `%${search}%` },
            },
            {
              body: { [Op.iLike]: `%${search}%` },
            },
          ],
        }
      : undefined;

    try {
      const data = await db.Article.findAndCountAll({
        limit: size,
        offset,
        order: [['createdAt', 'DESC']],
        where: { [Op.and]: [{ ...whereSearch, ...whereStatus }] },
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
        ],
      });
      const result = getPagingData(Number(page), size, data);

      return getResponse(res, OK, {
        data: result,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get a single article using slug
   * @description also returns inactive articles
   * @param req Request
   * @param res Response
   */
  get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    try {
      const article = await getArticleBySlug(res, slug, true);

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
}

const adminArticleCtrl = new AdminArticle();
export default adminArticleCtrl;
