import express from 'express';
import promotionCtrl from '../controllers/promotion';

const router = express.Router();

router.get('/plan/pubs', promotionCtrl.getAllAdsPlans);
router.get('/plan/story', promotionCtrl.getAllStoryPlans);

router.get('/pubs', promotionCtrl.getAllAds);
router.get('/story', promotionCtrl.getAllStory);

export default router;
