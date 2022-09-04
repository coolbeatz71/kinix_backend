/* eslint-disable consistent-return */
import { Request } from 'express';
import i18next from 'i18next';
import validate from '..';

class ArticleValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', i18next.t('LABEL_ARTICLE_TITLE'));
    await validate.empty(this.req, 'summary', i18next.t('LABEL_ARTICLE_SUMMARY'));
    await validate.empty(this.req, 'body', i18next.t('LABEL_ARTICLE_BODY'));
  };
}

export default ArticleValidator;
