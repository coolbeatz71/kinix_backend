import express from 'express';
import likeArticleCtrl from '../controllers/likeArticle';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.get('/:slug', likeArticleCtrl.getAllLikes);
router.get('/user/:slug', verifyToken, likeArticleCtrl.getLikeByUserId);
router.post('/:slug', verifyToken, likeArticleCtrl.create);
router.delete('/:slug', verifyToken, likeArticleCtrl.delete);

export default router;
