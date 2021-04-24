import express from 'express';
import articleCtrl from '../controllers/article';

const router = express.Router();

router.get('/', articleCtrl.getAll);
router.get('/:slug', articleCtrl.get);

export default router;
