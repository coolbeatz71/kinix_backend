/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { OK } from 'http-status';
import { DASHBOARD_OVERVIEW_SUCCESS } from '../../../constants/message';
import { contentResponse } from '../../../helpers/api';
import {
  countActiveArticles,
  countAllArticles,
  countInactiveArticles,
  countLikedArticles,
  countNonLikedArticles,
  countTopCommentedArticles,
  countTopLikedArticles,
} from '../../../helpers/article';
import countAllPromotions from '../../../helpers/promotion';
import {
  countActiveUsers,
  countAdminUsers,
  countAdsClients,
  countEmailDisabledUsers,
  countEmailEnabledUsers,
  countFacebookUsers,
  countGoogleUsers,
  countInactiveUsers,
  countLocalUsers,
  countSuperAdminUsers,
  countTotalUsers,
  countVideoClients,
  countViewerClients,
} from '../../../helpers/user';
import { countAllVideos } from '../../../helpers/video';
import {
  EUserStatus,
  EArticleStatus,
  EVideoStatus,
  EPromotionStatus,
} from '../../../interfaces/category';

export class AdminDashboard {
  /**
   * controller to get dashboard overview
   * @param req Request
   * @param res Response
   */
  getOverview = async (_req: Request, res: Response): Promise<any> => {
    // users overview
    const allUsers = await countTotalUsers(res, EUserStatus.ALL);
    const verifiedUsers = await countTotalUsers(res, EUserStatus.VERIFIED);
    const unverifiedUsers = await countTotalUsers(res, EUserStatus.UNVERIFIED);

    // articles overview
    const allArticles = await countAllArticles(res, EArticleStatus.ALL);
    const totalArticlesLikes = await countAllArticles(res, EArticleStatus.LIKE);
    const totalArticlesComments = await countAllArticles(res, EArticleStatus.COMMENT);

    // videos overview
    const allVideos = await countAllVideos(res, EVideoStatus.ALL);
    const ratedVideos = await countAllVideos(res, EVideoStatus.RATE);
    const sharedVideos = await countAllVideos(res, EVideoStatus.SHARE);

    // promotions overview
    const allPromotions = await countAllPromotions(res, EPromotionStatus.ALL);
    const activePromotions = await countAllPromotions(res, EPromotionStatus.ACTIVE);
    const inactivePromotions = await countAllPromotions(res, EPromotionStatus.INACTIVE);

    // users overview
    // users by activity
    const activeUsers = await countActiveUsers(res);
    const inactiveUsers = await countInactiveUsers(res);
    // users by provider
    const localUsers = await countLocalUsers(res);
    const googleUsers = await countGoogleUsers(res);
    const facebookUsers = await countFacebookUsers(res);
    // users by notification
    const activeNotification = await countEmailEnabledUsers(res);
    const inactiveNotification = await countEmailDisabledUsers(res);
    // users by role
    const viewerClients = await countViewerClients(res);
    const videoClients = await countVideoClients(res);
    const adsClients = await countAdsClients(res);
    const adminUsers = await countAdminUsers(res);
    const superAdminUsers = await countSuperAdminUsers(res);

    // articles overview
    // articles by activity
    const activeArticles = await countActiveArticles(res);
    const inactiveArticles = await countInactiveArticles(res);
    // articles by like
    const likedArticles = await countLikedArticles(res);
    const nonLikedArticles = await countNonLikedArticles(res);
    // top 5 liked articles
    const topLikedArticles = await countTopLikedArticles(res, 5);
    const topCommentedArticles = await countTopCommentedArticles(res, 5);

    const result = {
      general: {
        users: {
          all: Number(allUsers),
          verified: Number(verifiedUsers),
          unverified: Number(unverifiedUsers),
        },
        articles: {
          all: Number(allArticles),
          liked: Number(totalArticlesLikes),
          commented: Number(totalArticlesComments),
        },
        videos: {
          all: Number(allVideos),
          rated: Number(ratedVideos),
          shared: Number(sharedVideos),
        },
        promotions: {
          all: Number(allPromotions),
          active: Number(activePromotions),
          inactive: Number(inactivePromotions),
        },
      },
      users: {
        activity: {
          active: Number(activeUsers),
          inactive: Number(inactiveUsers),
        },
        provider: {
          local: Number(localUsers),
          google: Number(googleUsers),
          facebook: Number(facebookUsers),
        },
        notification: {
          active: Number(activeNotification),
          inactive: Number(inactiveNotification),
        },
        role: {
          ads: Number(adsClients),
          admin: Number(adminUsers),
          video: Number(videoClients),
          viewer: Number(viewerClients),
          superAdmin: Number(superAdminUsers),
        },
      },
      articles: {
        activity: {
          active: Number(activeArticles),
          inactive: Number(inactiveArticles),
        },
        likes: {
          liked: Number(likedArticles),
          nonLiked: Number(nonLikedArticles),
        },
        top: {
          likes: topLikedArticles,
          comments: topCommentedArticles,
        },
      },
    };

    return contentResponse(res, result, OK, DASHBOARD_OVERVIEW_SUCCESS);
  };
}

const adminDashboardCtrl = new AdminDashboard();
export default adminDashboardCtrl;
