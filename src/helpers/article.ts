/* eslint-disable consistent-return */
import { Response } from 'express';
import { getServerError } from './api';
import db from '../db/models';

export const getReadTime = (title: string, summary: string, body: string) => {
  const wordsPerMinute = 200;

  const wordCount = (text: string): number => text.split(' ').length;
  const words: number = wordCount(title) + wordCount(summary) + wordCount(body);

  return Math.ceil(words / wordsPerMinute);
};

const article = async (res: Response, field: string, value: any, isAdmin = false): Promise<any> => {
  const where = isAdmin ? { [field]: value } : { [field]: value, active: true };

  try {
    const result = await db.Article.findOne({
      where,
      attributes: { exclude: ['userId'] },
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
      ],
    });

    return result;
  } catch (err) {
    getServerError(res, err.message);
  }
};

export const getAllArticle = async (
  res: Response,
  limit: number,
  offset: number,
  active = true,
): Promise<any> => {
  try {
    const result = await db.Article.findAndCountAll({
      limit,
      offset,
      distinct: true,
      where: { active },
      order: [['updatedAt', 'DESC']],
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
      ],
    });

    return result;
  } catch (err) {
    getServerError(res, err.message);
  }
};

export const getArticleById = async (res: Response, id: number, isAdmin = false): Promise<any> => {
  return article(res, 'id', id, isAdmin);
};

export const getArticleBySlug = async (
  res: Response,
  slug: string,
  isAdmin = false,
): Promise<any> => {
  return article(res, 'slug', slug, isAdmin);
};

export const getArticleByTitle = async (
  res: Response,
  title: string,
  isAdmin = false,
): Promise<any> => {
  return article(res, 'title', title, isAdmin);
};
