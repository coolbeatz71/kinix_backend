/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class RateVideoValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.rate(this.req, 'count');
  };
}

export default RateVideoValidator;
