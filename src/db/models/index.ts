/* tslint:disable no-var-requires */
/* tslint:disable prefer-template */
/* eslint-disable */
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config.ts`)[env];

import { initArticle } from './article';
import { initCategory } from './category';
import { initLike } from './like';
import { initPlaylist } from './playlist';
import { initRate } from './rate';
import { initShare } from './share';
import { initUser } from './user';
import { initVideo } from './video';
import { initBookmark } from './bookmark';
import { initComment } from './comment';

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const db = {
  sequelize,
  Sequelize,
  User: initUser(sequelize),
  Article: initArticle(sequelize),
  Video: initVideo(sequelize),
  Category: initCategory(sequelize),
  Like: initLike(sequelize),
  Playlist: initPlaylist(sequelize),
  Rate: initRate(sequelize),
  Share: initShare(sequelize),
  Bookmark: initBookmark(sequelize),
  Comment: initComment(sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) model.associate(db);
});

export default db;
