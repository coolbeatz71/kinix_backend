import express from 'express';
import likeArticleCtrl from '../controllers/likeArticle';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.get('/user', verifyToken, likeArticleCtrl.getLikeByUserId);
router.get('/:slug', likeArticleCtrl.getAll);
router.get('/user/:slug', verifyToken, likeArticleCtrl.getSingleVideoUserLike);

router.post('/:slug', verifyToken, likeArticleCtrl.create);
router.delete('/:slug', verifyToken, likeArticleCtrl.delete);

export default router;
