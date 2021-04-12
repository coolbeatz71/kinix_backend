import { IJwtPayload } from './../../src/interfaces/api';

declare namespace Express {
  export interface Request {
    user?: IJwtPayload;
  }
  export interface Response {
    user?: IJwtPayload;
  }
}
