import express from 'express';
import authCtrl from '../controllers/auth';

const router = express.Router();

router.post('/signup/email', authCtrl.signupEmail);

export default router;
