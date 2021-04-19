import express from 'express';
import videoCtrl from '../controllers/video';

const router = express.Router();

router.get('/videos', videoCtrl.create);
router.get('/videos/:slug', videoCtrl.update);

export default router;
