import express from 'express';
import bookmarkArticleCtrl from '../controllers/bookmark';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.get('/user', verifyToken, bookmarkArticleCtrl.getBookmarkByUserId);
router.get('/:slug', bookmarkArticleCtrl.getAll);
router.get('/user/:slug', verifyToken, bookmarkArticleCtrl.getSingleArticleUserBookmark);

router.post('/:slug', verifyToken, bookmarkArticleCtrl.create);
router.delete('/:slug', verifyToken, bookmarkArticleCtrl.delete);

export default router;
