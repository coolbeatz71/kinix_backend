/* eslint-disable consistent-return */
import { Op } from 'sequelize';
import { Response } from 'express';
import { NOT_FOUND, OK } from 'http-status';
import { getResponse, getServerError } from './api';
import db from '../db/models';
import { getUserByName } from './user';
import { ARTICLE_NOT_FOUND, USER_NOT_FOUND } from '../constants/message';
import { getArticleBySlug } from './article';

const comment = async (res: Response, field: string, value: any): Promise<any> => {
  try {
    const result = await db.Comment.findOne({
      where: { [field]: value },
      include: [
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
      ],
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getAllComment = async (
  res: Response,
  slug: string,
  limit: number,
  offset: number,
  body: string | undefined,
  userName: string | undefined,
): Promise<any> => {
  let where;
  const article = await getArticleBySlug(res, slug);
  where = body ? { body: { [Op.iLike]: `%${body}%` } } : undefined;

  try {
    if (!article) {
      return getResponse(res, NOT_FOUND, {
        message: ARTICLE_NOT_FOUND,
      });
    }

    if (userName) {
      const user = await getUserByName(res, userName);

      if (!user) {
        return getResponse(res, NOT_FOUND, {
          message: USER_NOT_FOUND,
        });
      }

      where = { userId: user.get().id };
    }

    const result = await db.Comment.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      where: { articleId: article.get().id, ...where },
      include: [
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
      ],
    });

    return getResponse(res, OK, {
      data: result,
    });
  } catch (error) {
    return getServerError(res, error.message);
  }
};

export const getCommentById = async (res: Response, id: number): Promise<any> => {
  return comment(res, 'id', id);
};
