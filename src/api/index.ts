import { Router } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;
