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
export const encryptToken = (data: IJwtPayload, isAdmin = false): string => {
  const expiry = isAdmin ? { expiresIn: '3d' } : undefined;
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(data, secret, expiry);
  return token;
};

/**
 * generate the jwt for a user
 * @param user IJwtPayload
 * @returns string
 */
export const generateToken = (data: IUnknownObject, isAdmin = false): string => {
  const { id, userName, email, role } = data;
  return encryptToken(
    {
      id,
      userName,
      email,
      role,
    },
    isAdmin,
  );
};
