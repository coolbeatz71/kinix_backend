/* eslint-disable consistent-return */
import { Request } from 'express';
import i18next from 'i18next';
import validate from '..';

class CommentValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'body', i18next.t('LABEL_COMMENT'));
  };
}

export default CommentValidator;
