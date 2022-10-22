import express from 'express';
import rateVideoCtrl from '../controllers/rateVideo';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/:slug', verifyToken, rateVideoCtrl.create);
router.get('/user', verifyToken, rateVideoCtrl.getRateByUserId);
router.get('/user/:slug', verifyToken, rateVideoCtrl.getSingleVideoUserRatings);
router.get('/summary/:slug', rateVideoCtrl.getSingleVideoRateSummary);

export default router;
