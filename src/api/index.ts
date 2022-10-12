import { Router } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import videoRoutes from './routes/video';
import commentRoutes from './routes/comment';
import articleRoutes from './routes/article';
import videoRateRoutes from './routes/rate';
import shareVideoRoutes from './routes/share';
import likeArticleRoutes from './routes/like';
import promotionRoutes from './routes/promotion';
import bookmarkArticleRoutes from './routes/bookmark';
import videoPlaylistRoutes from './routes/playlist';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/videos', videoRoutes);
router.use('/articles', articleRoutes);
router.use('/comments', commentRoutes);
router.use('/rates', videoRateRoutes);
router.use('/shares', shareVideoRoutes);
router.use('/likes', likeArticleRoutes);
router.use('/promotions', promotionRoutes);
router.use('/playlists', videoPlaylistRoutes);
router.use('/bookmarks', bookmarkArticleRoutes);

export default router;
