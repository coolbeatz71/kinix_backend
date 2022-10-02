import express from 'express';
import articleCtrl from '../controllers/article';

const router = express.Router();

router.get('/', articleCtrl.getAll);
router.get('/tags', articleCtrl.getAllTags);
router.get('/featured', articleCtrl.getFeatured);
router.get('/related/:slug', articleCtrl.getRelated);
router.get('/:slug', articleCtrl.get);

export default router;
