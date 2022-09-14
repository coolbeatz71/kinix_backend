/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { OK } from 'http-status';
import { DASHBOARD_OVERVIEW_SUCCESS } from '../../../constants/message';
import { contentResponse, getServerError } from '../../../helpers/api';
import {
  countActiveArticles,
  countAllArticles,
  countInactiveArticles,
  countLikedArticles,
  countNonLikedArticles,
  countTopBookmarkedArticles,
  countTopCommentedArticles,
  countTopLikedArticles,
} from '../../../helpers/article';
import countAllPromotions, {
  countYearlyPromotion,
  getTotalAmountYearlyPromotion,
} from '../../../helpers/promotion';
import {
  countActiveUsers,
  countAdminUsers,
  countAdsClients,
  countBookmarkedUsers,
  countEmailDisabledUsers,
  countEmailEnabledUsers,
  countFacebookUsers,
  countGoogleUsers,
  countInactiveUsers,
  countLocalUsers,
  countPlaylistedUsers,
  countSuperAdminUsers,
  countTotalUsers,
  countVideoClients,
  countViewerClients,
} from '../../../helpers/user';
import {
  countActiveVideos,
  countAllVideos,
  countInactiveVideos,
  countTopPlaylistedVideos,
  countTopRatedVideos,
  countTopSharedVideos,
  countVideoByCategory,
} from '../../../helpers/video';
import ECategory, {
  EUserStatus,
  EArticleStatus,
  EVideoStatus,
  EPromotionStatus,
} from '../../../interfaces/category';
import EPromotionPlan, { EPromotionType } from '../../../interfaces/promotion';

export class AdminDashboard {
  /**
   * controller to get dashboard overview
   * @param req Request
   * @param res Response
   */
  getOverview = async (req: Request, res: Response): Promise<Response> => {
    try {
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
      // top 5 liked/commented articles
      const topLikedArticles = await countTopLikedArticles(res, 5);
      const topCommentedArticles = await countTopCommentedArticles(res, 5);

      // video overview
      // video by activity status
      const activeVideos = await countActiveVideos(res);
      const inactiveVideos = await countInactiveVideos(res);
      // video per category
      const musicVideos = await countVideoByCategory(res, ECategory.MUSIC_VIDEO);
      const interviews = await countVideoByCategory(res, ECategory.INTERVIEW);
      const podcasts = await countVideoByCategory(res, ECategory.PODCAST);
      const leFocus = await countVideoByCategory(res, ECategory.LEFOCUS);
      const flexBeatz = await countVideoByCategory(res, ECategory.FLEXBEATZ);
      // top 5 shared/rated videos
      const topSharedVideos = await countTopSharedVideos(res, 5);
      const topRatedVideos = await countTopRatedVideos(res, 5);

      // bookmarked article overview
      const bookmarkedArticles = await countAllArticles(res, EArticleStatus.BOOKMARK);
      const topBookmarkedArticles = await countTopBookmarkedArticles(res, 5);
      const bookmarkedUsers = await countBookmarkedUsers(res);
      // playlisted video overview
      const playlistedVideos = await countAllVideos(res, EVideoStatus.PLAYLIST);
      const topPlaylistedVideos = await countTopPlaylistedVideos(res, 5);
      const playlistedUsers = await countPlaylistedUsers(res);

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
        videos: {
          activity: {
            active: Number(activeVideos),
            inactive: Number(inactiveVideos),
          },
          category: {
            musicVideos,
            interviews,
            leFocus,
            flexBeatz,
            podcasts,
          },
          top: {
            shares: topSharedVideos,
            rates: topRatedVideos,
          },
        },
        bookmarks: {
          users: bookmarkedUsers,
          articles: bookmarkedArticles,
          top: {
            bookmarked: topBookmarkedArticles,
          },
        },
        playlists: {
          users: playlistedUsers,
          videos: playlistedVideos,
          top: {
            playlisted: topPlaylistedVideos,
          },
        },
      };

      return contentResponse(
        res,
        result,
        OK,
        req.t('DASHBOARD_OVERVIEW_SUCCESS'),
        DASHBOARD_OVERVIEW_SUCCESS,
      );
    } catch (err) {
      return getServerError(res, err.message);
    }
  };

  /**
   * controller to get ads overview
   * @param req Request
   * @param res Response
   */
  getAdsOverview = async (req: Request, res: Response): Promise<Response> => {
    const countFreeAds = await countYearlyPromotion(res, EPromotionType.ADS, EPromotionPlan.FREE);
    const countBasicAds = await countYearlyPromotion(res, EPromotionType.ADS, EPromotionPlan.BASIC);
    const countProfessionalAds = await countYearlyPromotion(
      res,
      EPromotionType.ADS,
      EPromotionPlan.PROFESSIONAL,
    );
    const countPremiumAds = await countYearlyPromotion(
      res,
      EPromotionType.ADS,
      EPromotionPlan.PREMIUM,
    );

    const freeAdsTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.ADS,
      EPromotionPlan.FREE,
    );
    const basicAdsTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.ADS,
      EPromotionPlan.BASIC,
    );
    const professionalAdsTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.ADS,
      EPromotionPlan.PROFESSIONAL,
    );
    const premiumAdsTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.ADS,
      EPromotionPlan.PREMIUM,
    );

    try {
      const result = {
        free: {
          amount: freeAdsTotal || 0,
          total: Number(countFreeAds),
        },
        basic: {
          amount: basicAdsTotal || 0,
          total: Number(countBasicAds),
        },
        professional: {
          amount: professionalAdsTotal || 0,
          total: Number(countProfessionalAds),
        },
        premium: {
          amount: premiumAdsTotal || 0,
          total: Number(countPremiumAds),
        },
      };

      return contentResponse(
        res,
        result,
        OK,
        req.t('DASHBOARD_OVERVIEW_SUCCESS'),
        DASHBOARD_OVERVIEW_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };

  /**
   * controller to get story overview
   * @param req Request
   * @param res Response
   */
  getStoryOverview = async (req: Request, res: Response): Promise<Response> => {
    const countFreeStory = await countYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.FREE,
    );
    const countBasicStory = await countYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.BASIC,
    );
    const countProfessionalStory = await countYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.PROFESSIONAL,
    );
    const countPremiumStory = await countYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.PREMIUM,
    );

    const freeStoryTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.FREE,
    );
    const basicStoryTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.BASIC,
    );
    const professionalStoryTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.PROFESSIONAL,
    );
    const premiumStoryTotal = await getTotalAmountYearlyPromotion(
      res,
      EPromotionType.STORY,
      EPromotionPlan.PREMIUM,
    );

    try {
      const result = {
        free: {
          amount: freeStoryTotal || 0,
          total: Number(countFreeStory),
        },
        basic: {
          amount: basicStoryTotal || 0,
          total: Number(countBasicStory),
        },
        professional: {
          amount: professionalStoryTotal || 0,
          total: Number(countProfessionalStory),
        },
        premium: {
          amount: premiumStoryTotal || 0,
          total: Number(countPremiumStory),
        },
      };

      return contentResponse(
        res,
        result,
        OK,
        req.t('DASHBOARD_OVERVIEW_SUCCESS'),
        DASHBOARD_OVERVIEW_SUCCESS,
      );
    } catch (error) {
      return getServerError(res, error.message);
    }
  };
}

const adminDashboardCtrl = new AdminDashboard();
export default adminDashboardCtrl;
