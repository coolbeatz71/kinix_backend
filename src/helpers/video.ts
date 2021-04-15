/* eslint-disable consistent-return */
import { Response } from 'express';
import { NOT_FOUND } from 'http-status';
import slugify from '@sindresorhus/slugify';
import { getResponse, getServerError } from './api';
import db from '../db/models';
import { CATEGORY_NOT_FOUND } from '../api/constants/message';

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

    return (
      result &&
      getResponse(res, NOT_FOUND, {
        message: CATEGORY_NOT_FOUND,
      })
    );
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
