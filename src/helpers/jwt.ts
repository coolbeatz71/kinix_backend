import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/api';
import { IUnknownObject } from '../interfaces/unknownObject';

config();

/**
 * generate the jwt for a user
 * @param {data} data IJwtPayload
 * @returns Promise<string>
 */
export const encryptToken = (data: IJwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(data, secret, { expiresIn: '3d' });
  return token;
};

/**
 * generate the jwt for a user
 * @param user IJwtPayload
 * @returns string
 */
export const generateToken = (data: IUnknownObject): string => {
  const { id, userName, role } = data;
  return encryptToken({
    id,
    userName,
    role,
  });
};
