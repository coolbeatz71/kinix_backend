import express from 'express';
import shareVideoCtrl from '../controllers/share-video';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/:slug', verifyToken, shareVideoCtrl.create);

export default router;
