/* eslint-disable consistent-return */
import { Request } from 'express';
import i18next from 'i18next';
import validate from '..';

class VideoValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', i18next.t('LABEL_VIDEO_TITLE'));
    await validate.empty(this.req, 'link', i18next.t('LABEL_VIDEO_LINK'));
    await validate.empty(this.req, 'userId', i18next.t('LABEL_USER_ID'));
    await validate.empty(this.req, 'categoryId', i18next.t('LABEL_CATEGORY_USER_ID'));
  };
}

export default VideoValidator;
