/* eslint-disable consistent-return */
import { Response } from 'express';
import { Sequelize } from 'sequelize';
import { getServerError } from './api';
import db from '../db/models';
import ECategory from '../interfaces/category';

const category = async (res: Response, field: string, value: any): Promise<any> => {
  try {
    const result = await db.Category.findOne({
      where: { [field]: value },
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

const video = async (res: Response, field: string, value: any, isAdmin = false): Promise<any> => {
  const where = isAdmin ? { [field]: value } : { [field]: value, active: true };

  try {
    const result = await db.Video.findOne({
      where,
      attributes: { exclude: ['userId', 'categoryId'] },
      include: [
        {
          as: 'category',
          model: db.Category,
          attributes: ['id', 'name'],
        },
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
        {
          as: 'rate',
          model: db.Rate,
        },
        {
          as: 'share',
          model: db.Share,
        },
      ],
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getAllVideo = async (
  res: Response,
  limit: number,
  offset: number,
  active = true,
): Promise<any> => {
  try {
    const result = await db.Video.findAndCountAll({
      limit,
      offset,
      distinct: true,
      where: { active },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          as: 'category',
          model: db.Category,
          attributes: ['id', 'name'],
        },
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
        {
          as: 'rate',
          model: db.Rate,
        },
        {
          as: 'share',
          model: db.Share,
        },
      ],
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getCategoryByName = async (res: Response, name: string): Promise<any> => {
  return category(res, 'name', name);
};

export const getCategoryById = async (res: Response, id: number): Promise<any> => {
  return category(res, 'id', id);
};

export const getVideoById = async (res: Response, id: number, isAdmin = false): Promise<any> => {
  return video(res, 'id', id, isAdmin);
};

export const getVideoBySlug = async (
  res: Response,
  slug: string,
  isAdmin = false,
): Promise<any> => {
  return video(res, 'slug', slug, isAdmin);
};

export const getVideoDiscovery = async (res: Response, categoryName: ECategory): Promise<any> => {
  try {
    const cat = await getCategoryByName(res, categoryName);

    const result = await db.Video.findAll({
      limit: 3,
      where: { active: true, categoryId: cat.get().id },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          as: 'category',
          model: db.Category,
          attributes: ['id', 'name'],
        },
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
        {
          as: 'rate',
          model: db.Rate,
        },
        {
          as: 'share',
          model: db.Share,
        },
      ],
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getVideoPopular = async (res: Response): Promise<any> => {
  try {
    const result = await db.Video.findAll({
      limit: 15,
      where: { active: true },
      order: [
        ['avgRate', 'DESC'],
        ['totalRaters', 'DESC'],
      ],
      include: [
        {
          as: 'category',
          model: db.Category,
          attributes: ['id', 'name'],
        },
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
        {
          as: 'rate',
          model: db.Rate,
        },
        {
          as: 'share',
          model: db.Share,
        },
      ],
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const getVideoByCategory = async (res: Response, name: ECategory): Promise<any> => {
  try {
    const cat = await getCategoryByName(res, name);
    const result = await db.Video.findAll({
      limit: 15,
      where: { active: true, categoryId: cat.get().id },
      order: [['avgRate', 'DESC']],
      include: [
        {
          as: 'category',
          model: db.Category,
          attributes: ['id', 'name'],
        },
        {
          as: 'user',
          model: db.User,
          attributes: ['id', 'userName', 'email', 'phoneNumber', 'image', 'role'],
        },
        {
          as: 'rate',
          model: db.Rate,
        },
        {
          as: 'share',
          model: db.Share,
        },
      ],
    });

    return result;
  } catch (err) {
    return getServerError(res, err.message);
  }
};

export const calcVideoAVGRate = async (res: Response, videoId: number): Promise<any> => {
  try {
    const rate = db.Rate.findAll({
      where: { videoId },
      attributes: [
        [Sequelize.cast(Sequelize.fn('SUM', Sequelize.col('count')), 'int'), 'sumRate'],
        [Sequelize.cast(Sequelize.fn('COUNT', Sequelize.col('count')), 'int'), 'totalRaters'],
      ],
    });

    return rate;
  } catch (err) {
    return getServerError(res, err.message);
  }
};
