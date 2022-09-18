import express from 'express';
import promotionCtrl from '../controllers/promotion';

const router = express.Router();

router.get('/plan/ads', promotionCtrl.getAllAdsPlans);
router.get('/plan/story', promotionCtrl.getAllStoryPlans);

router.get('/ads', promotionCtrl.getAllAds);
router.get('/story', promotionCtrl.getAllStory);

export default router;
