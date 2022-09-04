import ERole from './role';

export interface IResponseBody {
  token?: string;
  code?: string;
  message?: any;
  data?: any;
}

export interface IJwtPayload {
  id: number;
  userName: string;
  email: string;
  role: ERole;
}

export enum EnumStatus {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
