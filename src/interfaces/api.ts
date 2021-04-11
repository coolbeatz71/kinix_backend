import ERole from './role';

export interface IResponseBody {
  token?: string;
  message?: any;
  data?: any;
}

export interface IJwtPayload {
  id: string;
  userName: string;
  role: ERole;
}
