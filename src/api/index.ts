import { Router } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import videoRoutes from './routes/video';
import commentRoutes from './routes/comment';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/videos', videoRoutes);
router.use('/comments', commentRoutes);

export default router;
