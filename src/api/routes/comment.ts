import express from 'express';
import commentCtrl from '../controllers/comment';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/:slug', verifyToken, commentCtrl.create);
router.get('/:slug', commentCtrl.getAll);
router.delete('/comments/:slug/:id', verifyToken, commentCtrl.delete);
// router.put('/comments/:slug/:id', verifyToken, commentCtrl.update);

export default router;
