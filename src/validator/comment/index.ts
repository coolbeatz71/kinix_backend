/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class CommentValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'body', this.req.t('LABEL_COMMENT'));
  };
}

export default CommentValidator;
