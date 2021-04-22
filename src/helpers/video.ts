/* eslint-disable consistent-return */
import { Response } from 'express';
import slugify from '@sindresorhus/slugify';
import { getResponse, getServerError } from './api';
import db from '../db/models';
import { IVideo, IArticle } from '../interfaces/model';

export const generateSlug = async (title: string) => {
  return `${await slugify(title, { lowercase: true })}-${
    Math.floor(Math.random() * 999999999) + 100000000
  }`;
};

const category = async (res: Response, field: string, value: any): Promise<any> => {
  try {
    const result = await db.Category.findOne({
      where: { [field]: value },
    });

    return result;
  } catch (err) {
    getServerError(res, err.message);
  }
};

const video = async (res: Response, field: string, value: any, active = true): Promise<any> => {
  try {
    const result = await db.Video.findOne({
      where: { [field]: value, active },
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
    getServerError(res, err.message);
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
    getServerError(res, err.message);
  }
};

export const getCategoryByName = async (res: Response, name: string): Promise<any> => {
  return category(res, 'name', name);
};

export const getCategoryById = async (res: Response, id: number): Promise<any> => {
  return category(res, 'id', id);
};

export const getVideoById = async (res: Response, id: number): Promise<any> => {
  return video(res, 'id', id);
};

export const getVideoBySlug = async (res: Response, slug: string): Promise<any> => {
  return video(res, 'slug', slug);
};

export const contentResponse = (
  res: Response,
  data: IVideo | IArticle,
  status: number,
  message?: string,
) => {
  return getResponse(res, status, {
    message,
    data,
  });
};
