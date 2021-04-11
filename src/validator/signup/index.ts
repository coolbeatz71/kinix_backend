/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { EAuthChannel } from '../../interfaces/role';
import validate from '..';
import { getValidationError } from '../../helpers/api';

class SignupValidator {
  private req!: Request;
  private res!: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  run = async (channel: EAuthChannel): Promise<void> => {
    await validate.names(this.req, 'userName', 'username');
    await validate.password(this.req, 'password');

    if (channel === EAuthChannel.EMAIL) await validate.email(this.req, 'email');
    if (channel === EAuthChannel.TELEPHONE) await validate.phoneNumber(this.req, 'phoneNumber');

    const errors = validationResult(this.req);
    if (!errors.isEmpty()) return getValidationError(this.res, errors);
  };
}

export default SignupValidator;
