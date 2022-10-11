import express from 'express';
import shareVideoCtrl from '../controllers/shareVideo';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.get('/:slug', verifyToken, shareVideoCtrl.getAll);
router.post('/:slug', verifyToken, shareVideoCtrl.create);

export default router;
