import express from 'express';
import articleRateCtrl from '../controllers/rate';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/:slug', verifyToken, articleRateCtrl.create);

export default router;
