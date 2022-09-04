/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class VideoValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_VIDEO_TITLE'));
    await validate.empty(this.req, 'link', this.req.t('LABEL_VIDEO_LINK'));
    await validate.empty(this.req, 'userId', this.req.t('LABEL_USER_ID'));
    await validate.empty(this.req, 'categoryId', this.req.t('LABEL_CATEGORY_USER_ID'));
  };
}

export default VideoValidator;
