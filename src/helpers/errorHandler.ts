import * as httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware Handle 404 Not found error
 * @param _req Request
 * @param res Response
 * @param _next NextFunction
 */
export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    message: 'Requested Resource Not Found',
  });
};
