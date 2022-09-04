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
    await validate.names(this.req, 'userName', this.req.t('LABEL_USERNAME'));
    await validate.empty(this.req, 'role', this.req.t('LABEL_ACCOUNT_TYPE'));
  };

  updateAccount = async (): Promise<void> => {
    await validate.email(this.req, 'email');
    await validate.names(this.req, 'userName', this.req.t('LABEL_USERNAME'));
    await validate.empty(this.req, 'role', this.req.t('LABEL_ACCOUNT_TYPE'));
  };
}

export default UserValidator;
