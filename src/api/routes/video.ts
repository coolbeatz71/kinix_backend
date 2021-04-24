import express from 'express';
import videoCtrl from '../controllers/video';

const router = express.Router();

router.get('/', videoCtrl.getAll);
router.get('/feed', videoCtrl.getFeed);
router.get('/:slug', videoCtrl.get);

export default router;
