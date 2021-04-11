export interface IJwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface IResponseBody {
  token?: string;
  message?: any;
  data?: any;
}
