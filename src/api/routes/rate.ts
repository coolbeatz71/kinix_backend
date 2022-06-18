import express from 'express';
import rateVideoCtrl from '../controllers/rateVideo';
import { verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/:slug', verifyToken, rateVideoCtrl.create);

export default router;
