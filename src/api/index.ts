import { Router } from 'express';
import authRoutes from './routes/auth';

const router: Router = Router();

router.use('/auth', authRoutes);

export default router;
