/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { countAllArticles } from '../../../helpers/article';
import { countTotalUsers } from '../../../helpers/user';
import { countAllVideos } from '../../../helpers/video';
import { EArticleStatus, EUserStatus, EVideoStatus } from '../../../interfaces/category';

export class AdminDashboard {
  /**
   * controller to get dashboard overview
   * @param req Request
   * @param res Response
   */
  getOverview = async (req: Request, res: Response): Promise<any> => {
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
  };
}

const adminDashboardCtrl = new AdminDashboard();
export default adminDashboardCtrl;
