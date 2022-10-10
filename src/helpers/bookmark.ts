import { Response } from 'express';
import db from '../db/models';
import { getServerError } from './api';

// get all articles that a user bookmarked
export const getBookmarkByUserId = async (res: Response, userId: number): Promise<any> => {
  try {
    const result = await db.Bookmark.findAndCountAll({
      where: { userId },
      include: [
        {
          as: 'article',
          model: db.Article,
        },
      ],
    });
    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

// get bookmarks for a specific article
const getAllBookmarks = async (res: Response, articleId: number): Promise<any> => {
  try {
    const result = await db.Bookmark.findAndCountAll({
      distinct: true,
      where: { articleId },
    });
    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default getAllBookmarks;
