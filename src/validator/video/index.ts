/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class VideoValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', 'video title');
    await validate.empty(this.req, 'link', 'video link');
    await validate.empty(this.req, 'userId', 'user id');
    await validate.empty(this.req, 'categoryId', 'category id');
  };
}

export default VideoValidator;
