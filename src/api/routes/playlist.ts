import express from 'express';
import playlistCtrl from '../controllers/playlistVideo';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.get('/', verifyToken, playlistCtrl.getAll);
router.get('/:slug', verifyToken, playlistCtrl.get);
router.post('/:slug', verifyToken, playlistCtrl.create);

router.delete('/:slug', verifyToken, playlistCtrl.delete);
router.delete('/video/:slug', verifyToken, playlistCtrl.removeVideo);

export default router;
