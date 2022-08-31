/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class ArticleValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_ARTICLE_TITLE'));
    await validate.empty(this.req, 'summary', this.req.t('LABEL_ARTICLE_SUMMARY'));
    await validate.empty(this.req, 'body', this.req.t('LABEL_ARTICLE_BODY'));
  };
}

export default ArticleValidator;
