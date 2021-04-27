import { Router } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import videoRoutes from './routes/video';
import commentRoutes from './routes/comment';
import articleRoutes from './routes/article';
import articleRateRoutes from './routes/rate';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/videos', videoRoutes);
router.use('/articles', articleRoutes);
router.use('/comments', commentRoutes);
router.use('/rates', articleRateRoutes);

export default router;
