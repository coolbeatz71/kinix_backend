import { Response } from 'express';
import db from '../db/models';
import { getServerError } from './api';

// get all articles that a user liked
export const getLikeByUserId = async (res: Response, userId: number): Promise<any> => {
  try {
    const result = await db.Like.findAndCountAll({
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

// get likes for a specific article
const getAllLikes = async (res: Response, articleId: number): Promise<any> => {
  try {
    const result = await db.Like.findAndCountAll({
      where: { articleId },
    });
    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export default getAllLikes;
