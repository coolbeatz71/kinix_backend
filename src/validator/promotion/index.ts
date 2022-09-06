/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class PromotionValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  createPlan = async (): Promise<void> => {
    await validate.price(this.req, 'price');
    await validate.duration(this.req, 'duration');
  };
}

export default PromotionValidator;
