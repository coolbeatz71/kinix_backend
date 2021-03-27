import express from 'express';
import authCtrl from './../controllers/auth';

const router = express.Router();

router.post('/signup', authCtrl.signup);

export default router;
