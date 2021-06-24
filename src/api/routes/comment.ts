import express from 'express';
import commentCtrl from '../controllers/comment-article';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/:slug', verifyToken, commentCtrl.create);
router.get('/:slug', commentCtrl.getAll);
router.delete('/:slug/:id', verifyToken, commentCtrl.delete);
router.put('/:slug/:id', verifyToken, commentCtrl.update);

export default router;
