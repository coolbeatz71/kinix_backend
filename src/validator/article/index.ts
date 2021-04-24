/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class ArticleValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', 'article title');
    await validate.empty(this.req, 'summary', 'article summary');
    await validate.empty(this.req, 'body', 'article body');
  };
}

export default ArticleValidator;
