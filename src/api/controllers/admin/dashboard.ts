/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { OK } from 'http-status';
import { DASHBOARD_OVERVIEW_SUCCESS } from '../../../constants/message';
import { contentResponse } from '../../../helpers/api';
import { countAllArticles } from '../../../helpers/article';
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
  EArticleStatus,
  EPromotionStatus,
  EUserStatus,
  EVideoStatus,
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
    const likedArticles = await countAllArticles(res, EArticleStatus.LIKE);
    const commentedArticles = await countAllArticles(res, EArticleStatus.COMMENT);

    // videos overview
    const allVideos = await countAllVideos(res, EVideoStatus.ALL);
    const ratedVideos = await countAllVideos(res, EVideoStatus.RATE);
    const sharedVideos = await countAllVideos(res, EVideoStatus.SHARE);

    // promotions overview
    const allPromotions = await countAllPromotions(res, EPromotionStatus.ALL);
    const activePromotions = await countAllPromotions(res, EPromotionStatus.ACTIVE);
    const inactivePromotions = await countAllPromotions(res, EPromotionStatus.INACTIVE);

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

    const result = {
      general: {
        users: {
          all: allUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
        },
        articles: {
          all: allArticles,
          liked: likedArticles,
          commented: commentedArticles,
        },
        videos: {
          all: allVideos,
          rated: ratedVideos,
          shared: sharedVideos,
        },
        promotions: {
          all: allPromotions,
          active: activePromotions,
          inactive: inactivePromotions,
        },
      },
      users: {
        activity: {
          active: activeUsers,
          inactive: inactiveUsers,
        },
        provider: {
          local: localUsers,
          google: googleUsers,
          facebook: facebookUsers,
        },
        notification: {
          active: activeNotification,
          inactive: inactiveNotification,
        },
        role: {
          ads: adsClients,
          admin: adminUsers,
          video: videoClients,
          viewer: viewerClients,
          superAdmin: superAdminUsers,
        },
      },
    };

    return contentResponse(res, result, OK, DASHBOARD_OVERVIEW_SUCCESS);
  };
}

const adminDashboardCtrl = new AdminDashboard();
export default adminDashboardCtrl;
