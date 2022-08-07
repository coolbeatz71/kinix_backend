/* eslint-disable consistent-return */
import { Response } from 'express';
import { literal } from 'sequelize';
import { getServerError } from './api';
import db from '../db/models';
import { EArticleStatus } from '../interfaces/category';

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
      attributes: {
        exclude: ['userId'],
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

    return result;
  } catch (err) {
    return getServerError(res, err.message);
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

    return result;
  } catch (err) {
    return getServerError(res, err.message);
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

export const countAllArticles = async (
  res: Response,
  status: EArticleStatus,
): Promise<Response | number> => {
  try {
    let result;
    switch (status) {
      case EArticleStatus.COMMENT:
        result = db.Comment.count();
        break;
      case EArticleStatus.LIKE:
        result = db.Like.count();
        break;
      case EArticleStatus.BOOKMARK:
        result = db.Bookmark.count();
        break;
      default:
        result = db.Article.count();
        break;
    }

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const countArticlesBy = async (
  res: Response,
  field: string,
  value: any,
): Promise<Response | number> => {
  try {
    const result = await db.Article.count({
      where: { [field]: value },
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

// count articles by activity status
export const countActiveArticles = async (res: Response) => {
  return countArticlesBy(res, 'active', true);
};
export const countInactiveArticles = async (res: Response) => {
  return countArticlesBy(res, 'active', false);
};
// count articles by like status
export const countLikedArticles = async (res: Response) => {
  return countArticlesBy(res, 'liked', true);
};
export const countNonLikedArticles = async (res: Response) => {
  return countArticlesBy(res, 'liked', false);
};

export const countTopLikedArticles = async (res: Response, limit = 5) => {
  try {
    const result = db.Article.findAll({
      attributes: [
        'id',
        'title',
        'slug',
        [
          literal('(SELECT COUNT(*) FROM "like" WHERE "like"."articleId" = "Article"."id")'),
          'likesCount',
        ],
      ],
      order: [[literal('"likesCount"'), 'DESC']],
      limit,
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const countTopCommentedArticles = async (res: Response, limit = 5) => {
  try {
    const result = db.Article.findAll({
      attributes: [
        'id',
        'title',
        'slug',
        [
          literal('(SELECT COUNT(*) FROM "comment" WHERE "comment"."articleId" = "Article"."id")'),
          'commentsCount',
        ],
      ],
      order: [[literal('"commentsCount"'), 'DESC']],
      limit,
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const countTopBookmarkedArticles = async (res: Response, limit = 5) => {
  try {
    const result = db.Article.findAll({
      attributes: [
        'id',
        'title',
        'slug',
        [
          literal(
            '(SELECT COUNT(*) FROM "bookmark" WHERE "bookmark"."articleId" = "Article"."id")',
          ),
          'bookmarksCount',
        ],
      ],
      order: [[literal('"bookmarksCount"'), 'DESC']],
      limit,
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};
