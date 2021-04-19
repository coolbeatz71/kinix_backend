import express from 'express';
import videoCtrl from '../controllers/video';

const router = express.Router();

router.get('/', videoCtrl.getAll);
router.get('/:slug', videoCtrl.get);

export default router;
