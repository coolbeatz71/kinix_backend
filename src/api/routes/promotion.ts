import express from 'express';
import promotionCtrl from '../controllers/promotion';

const router = express.Router();

router.get('/plan/ads', promotionCtrl.getAllAdsPlans);
router.get('/plan/story', promotionCtrl.getAllStoryPlans);

export default router;
