/* eslint-disable consistent-return */
import { Response } from 'express';
import slugify from '@sindresorhus/slugify';
import { getServerError } from './api';
import db from '../db/models';

export const generateSlug = async (title: string) => {
  return `${await slugify(title, { lowercase: true })}-${
    Math.floor(Math.random() * 999999999) + 100000000
  }`;
};

const category = async (res: Response, field: string, value: any): Promise<any> => {
  try {
    const result = await db.Category.findOne({
      where: { [field]: `${value}` },
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
  try {
    const result = await db.Video.findOne({
      where: { id },
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
      ],
    });

    return result;
  } catch (err) {
    getServerError(res, err.message);
  }
};
