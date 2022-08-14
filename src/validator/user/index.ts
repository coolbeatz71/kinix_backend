/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class UserValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  createAccount = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.password(this.req, 'password');
    await validate.names(this.req, 'userName', 'username');
    await validate.empty(this.req, 'account type', 'role');
  };

  updateAccount = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', 'username');
    await validate.empty(this.req, 'account type', 'role');
  };
}

export default UserValidator;
