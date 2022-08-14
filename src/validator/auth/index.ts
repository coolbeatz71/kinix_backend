/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class AuthValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  signup = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', 'username');
    await validate.password(this.req, 'password');
  };

  login = async (): Promise<void> => {
    await validate.empty(this.req, 'credential', 'username or email');
    await validate.password(this.req, 'password');
  };
}

export default AuthValidator;
