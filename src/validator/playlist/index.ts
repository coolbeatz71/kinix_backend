/* eslint-disable consistent-return */
import { Request } from 'express';
import validate from '..';

class PlaylistValidator {
  private req!: Request;

  constructor(req: Request) {
    this.req = req;
  }

  create = async (): Promise<void> => {
    await validate.empty(this.req, 'title', this.req.t('LABEL_PLAYLIST_TITLE'));
    await validate.empty(this.req, 'videoId', this.req.t('LABEL_PLAYLIST_VIDEO'));
  };

  removeVideo = async (): Promise<void> => {
    await validate.empty(this.req, 'videoId', this.req.t('LABEL_PLAYLIST_VIDEO'));
  };
}

export default PlaylistValidator;
