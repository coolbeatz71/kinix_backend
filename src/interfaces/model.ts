/* eslint-disable no-use-before-define */
import { ModelStatic, Model } from 'sequelize';
import EProvider from './provider';
import ERole from './role';
import EPromotionPlan from './promotion';
import ECategory from './category';

export interface IModel {
  User: ModelStatic<Model<IUser, any>>;
  Article: ModelStatic<Model<IArticle, any>>;
  Comment: ModelStatic<Model<IComment, any>>;
  Video: ModelStatic<Model<IVideo, any>>;
  Playlist: ModelStatic<Model<IPlaylist, any>>;
  Bookmark: ModelStatic<Model<IBookmark, any>>;
  Like: ModelStatic<Model<ILike, any>>;
  Category: ModelStatic<Model<ICategory, any>>;
  Share: ModelStatic<Model<IShare, any>>;
  Rate: ModelStatic<Model<IRate, any>>;
  Ads: ModelStatic<Model<IAds, any>>;
  AdsPlan: ModelStatic<Model<IAdsPlan, any>>;
  Story: ModelStatic<Model<IStory, any>>;
  StoryPlan: ModelStatic<Model<IStoryPlan, any>>;
}

export interface IUser {
  readonly id?: number;
  userName: string;
  password?: string;
  email?: string | null;
  phoneNumber?: string | null;
  provider?: EProvider;
  isLoggedIn?: boolean;
  verified?: boolean;
  active?: boolean;
  image?: string | null;
  allowEmailNotification?: boolean;
  role?: ERole;
  countryName?: string;
  countryFlag?: string;
  phoneISOCode?: string;
  phoneDialCode?: string;
  phonePartial?: string;
  otp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IArticle {
  readonly id?: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  images: string[] | null;
  reads: number;
  tags: string[] | null;
  active?: boolean;
  featured?: boolean;
  liked?: boolean;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IComment {
  readonly id?: number;
  userId: number;
  articleId: number;
  body: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVideo {
  readonly id?: number;
  slug: string;
  link: string;
  title: string;
  tags: string[] | null;
  active?: boolean;
  avgRate?: number;
  totalRaters?: number;
  shared?: boolean;
  userId: number;
  lyrics?: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBookmark {
  readonly id?: number;
  userId: number;
  articleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  readonly id?: number;
  name: ECategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILike {
  readonly id?: number;
  userId: number;
  articleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPlaylist {
  readonly id?: number;
  slug: string;
  title: string;
  userId: number;
  video?: IVideo;
  videoId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRate {
  readonly id?: number;
  userId: number | null;
  videoId: number;
  count: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IShare {
  readonly id?: number;
  userId: number | null;
  videoId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAds {
  readonly id?: number;
  userId: number | null;
  planId: number;
  plan?: string;
  amount?: number;
  slug: string;
  legend: string;
  title: string;
  subTitle: string;
  body: string;
  redirectUrl?: string | null;
  image: string;
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IStory {
  readonly id?: number;
  userId: number | null;
  planId: number;
  plan?: string;
  amount?: number;
  slug: string;
  legend: string;
  title: string;
  subTitle: string;
  body: string;
  redirectUrl?: string | null;
  media: string;
  mediaType: string;
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdsPlan {
  readonly id?: number;
  name: EPromotionPlan;
  price: number;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
}
export type IStoryPlan = IAdsPlan;
