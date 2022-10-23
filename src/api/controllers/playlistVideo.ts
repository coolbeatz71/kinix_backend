import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { chain, isEmpty, omit } from 'lodash';
import { CREATED, NOT_FOUND, OK } from 'http-status';
import { validationResult } from 'express-validator';
import {
  PLAYLIST_CREATED_SUCCESS,
  PLAYLIST_DELETED_SUCCESS,
  PLAYLIST_NOT_FOUND,
  PLAYLIST_UPDATED_SUCCESS,
  VIDEO_ADDED_TO_PLAYLIST__SUCCESS,
  VIDEO_NOT_FOUND,
  VIDEO_REMOVED_FROM_PLAYLIST_SUCCESS,
} from '../../constants/message';
import db from '../../db/models';
import { generateSlug, getResponse, getServerError, getValidationError } from '../../helpers/api';
import { getVideoById } from '../../helpers/video';
import { IJwtPayload } from '../../interfaces/api';
import PlaylistValidator from '../../validator/playlist';
import { IPlaylist } from '../../interfaces/model';

export class Playlist {
  /**
   * controller to create playlist and add a video
   * @param req Request
   * @param res Response
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.query;
    const isSlug = !isEmpty(slug);
    const { title, videoId } = req.body;
    const { id: userId } = req.user as IJwtPayload;

    await new PlaylistValidator(req).create();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const video = await getVideoById(res, videoId);

      if (!video) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_NOT_FOUND,
          message: req.t('VIDEO_NOT_FOUND'),
        });
      }

      const isPlaylistExist = await db.Playlist.findOne({
        where: { [Op.and]: [{ title }, { userId }] },
      });
      const isVideoExistInPlaylist = await db.Playlist.findOne({
        where: { [Op.and]: [{ title }, { videoId }, { userId }] },
      });

      if (isVideoExistInPlaylist) {
        return getResponse(res, OK, {
          data: isVideoExistInPlaylist,
          code: PLAYLIST_UPDATED_SUCCESS,
          message: req.t('PLAYLIST_UPDATED_SUCCESS'),
        });
      }

      if (!isSlug && isPlaylistExist) {
        const created = await db.Playlist.create({
          title,
          userId,
          videoId,
          slug: isPlaylistExist.get().slug,
        });

        return getResponse(res, OK, {
          data: created,
          code: PLAYLIST_UPDATED_SUCCESS,
          message: req.t('PLAYLIST_UPDATED_SUCCESS'),
        });
      }

      if (!isSlug && !isVideoExistInPlaylist) {
        const newSlug = await generateSlug(title);
        const created = await db.Playlist.create({
          title,
          userId,
          videoId,
          slug: newSlug,
        });

        return getResponse(res, CREATED, {
          data: created,
          code: PLAYLIST_CREATED_SUCCESS,
          message: req.t('PLAYLIST_CREATED_SUCCESS'),
        });
      }

      const playlist = await db.Playlist.findOne({
        where: { [Op.and]: [{ slug: `${slug}` }, { userId }] },
      });

      if (!playlist) {
        return getResponse(res, NOT_FOUND, {
          code: PLAYLIST_NOT_FOUND,
          message: req.t('PLAYLIST_NOT_FOUND'),
        });
      }

      const created = await db.Playlist.create({
        userId,
        videoId,
        slug: playlist.get().slug,
        title: playlist.get().title,
      });

      return getResponse(res, CREATED, {
        data: created,
        code: VIDEO_ADDED_TO_PLAYLIST__SUCCESS,
        message: req.t('VIDEO_ADDED_TO_PLAYLIST__SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to remove a video from the playlist
   * @param req Request
   * @param res Response
   */
  removeVideo = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { videoId } = req.body;
    const { id: userId } = req.user as IJwtPayload;

    await new PlaylistValidator(req).removeVideo();
    const errors = validationResult(req);
    if (!errors.isEmpty()) return getValidationError(res, errors);

    try {
      const video = await getVideoById(res, videoId);
      const isVideoExistInPlaylist = await db.Playlist.findOne({
        where: { [Op.and]: [{ slug }, { videoId }, { userId }] },
      });

      if (!video || !isVideoExistInPlaylist) {
        return getResponse(res, NOT_FOUND, {
          code: VIDEO_NOT_FOUND,
          message: req.t('VIDEO_NOT_FOUND'),
        });
      }

      await db.Playlist.destroy({
        where: {
          slug,
          userId,
          videoId,
        },
      });

      return getResponse(res, OK, {
        code: VIDEO_REMOVED_FROM_PLAYLIST_SUCCESS,
        message: req.t('VIDEO_REMOVED_FROM_PLAYLIST_SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to delete a playlist
   * @param req Request
   * @param res Response
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;

    try {
      const playlist = await db.Playlist.destroy({
        where: { [Op.and]: [{ slug }, { userId }] },
      });

      if (playlist === 0) {
        return getResponse(res, NOT_FOUND, {
          code: PLAYLIST_NOT_FOUND,
          message: req.t('PLAYLIST_NOT_FOUND'),
        });
      }

      return getResponse(res, NOT_FOUND, {
        code: PLAYLIST_DELETED_SUCCESS,
        message: req.t('PLAYLIST_DELETED_SUCCESS'),
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all playlists for a user
   * @param req Request
   * @param res Response
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const { id: userId } = req.user as IJwtPayload;
    try {
      const playlists = await db.Playlist.findAndCountAll({
        where: { userId },
      });

      return getResponse(res, OK, {
        data: playlists,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get a single playlist details
   * @param req Request
   * @param res Response
   */
  get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;
    const { id: userId } = req.user as IJwtPayload;
    try {
      const playlist = await db.Playlist.findAll({
        raw: true,
        nest: true,
        where: { [Op.and]: [{ userId }, { slug }] },
        include: [
          {
            as: 'video',
            model: db.Video,
          },
        ],
      });

      const data = omit(playlist[0], ['video', 'videoId']);
      const videos = playlist.map((dt: IPlaylist) => dt.video);
      return getResponse(res, OK, {
        data: {
          ...data,
          videos,
        },
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get all playlists details for a user
   * @param req Request
   * @param res Response
   */
  getPlaylistsDetails = async (req: Request, res: Response): Promise<Response> => {
    const { id: userId } = req.user as IJwtPayload;
    try {
      const playlists = await db.Playlist.findAll({
        where: { userId },
        include: [
          {
            as: 'video',
            model: db.Video,
          },
        ],
        raw: true,
        nest: true,
      });

      const data = chain(playlists)
        .groupBy('slug')
        .map((lists: IPlaylist[]) => ({
          slug: lists[0].slug,
          title: lists[0].title,
          createdAt: lists[0].createdAt,
          updatedAt: lists[0].updatedAt,
          videos: lists.map(({ slug, title, createdAt, updatedAt, ...rest }) => rest),
        }))
        .value();

      return getResponse(res, OK, {
        data,
      });
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const playlistCtrl = new Playlist();
export default playlistCtrl;
