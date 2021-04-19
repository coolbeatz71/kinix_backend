import { ModelStatic, Model } from 'sequelize';
import EProvider from './provider';
import ERole from './role';

/* eslint-disable no-use-before-define */
export interface IModel {
  User: ModelStatic<Model<IUser, any>>;
  Article: ModelStatic<Model<IArticle, any>>;
  Video: ModelStatic<Model<IVideo, any>>;
  Playlist: ModelStatic<Model<IPlaylist, any>>;
  Bookmark: ModelStatic<Model<IBookmark, any>>;
  Like: ModelStatic<Model<ILike, any>>;
  Category: ModelStatic<Model<ICategory, any>>;
  Share: ModelStatic<Model<IShare, any>>;
  Rate: ModelStatic<Model<IRate, any>>;
}

export interface IUser {
  readonly id?: number;
  userName: string;
  password: string;
  email?: string | null;
  phoneNumber?: string | null;
  provider?: EProvider;
  isLoggedIn?: boolean;
  verified?: boolean;
  image?: string | null;
  allowEmailNotification?: boolean;
  role?: ERole;
  createdAt?: string;
  updatedAt?: string;
}

export interface IArticle {
  readonly id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  images: string[] | null;
  video: string[] | null;
  reads: number;
  tags: string[] | null;
  active: boolean;
  liked: boolean;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVideo {
  readonly id: number;
  slug: string;
  link: string;
  title: string;
  tags: string[] | null;
  active: boolean;
  shared: boolean;
  userId: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBookmark {
  readonly id: number;
  userId: number;
  articleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  readonly id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILike {
  readonly id: number;
  userId: number;
  articleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPlaylist {
  readonly id: number;
  slug: string;
  title: string;
  userId: number;
  videoId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRate {
  readonly id: number;
  userId: number | null;
  videoId: number;
  count: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IShare {
  readonly id: number;
  userId: number | null;
  videoId: number;
  createdAt?: string;
  updatedAt?: string;
}
