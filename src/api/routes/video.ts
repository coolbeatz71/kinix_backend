import express from 'express';
import videoCtrl from '../controllers/video';

const router = express.Router();

router.get('/', videoCtrl.getAll);
router.get('/feed', videoCtrl.getFeed);
router.get('/tags', videoCtrl.getAllTags);
router.get('/popular', videoCtrl.getPopular);
router.get('/categories', videoCtrl.getAllCategories);

router.get('/:slug', videoCtrl.get);
router.get('/related/:slug', videoCtrl.getRelated);

export default router;
