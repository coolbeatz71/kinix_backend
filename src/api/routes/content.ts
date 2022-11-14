import express from 'express';
import contentCtrl from '../controllers/content';

const router = express.Router();

router.get('/search', contentCtrl.search);

export default router;
