import express from 'express';
import articleCtrl from '../controllers/article';

const router = express.Router();

router.get('/', articleCtrl.getAll);
router.get('/tags', articleCtrl.getAllTags);
router.get('/search', articleCtrl.getByTags);
router.get('/:slug', articleCtrl.get);
router.get('/related/:slug', articleCtrl.getRelated);
router.get('/featured', articleCtrl.getFeatured);

export default router;
