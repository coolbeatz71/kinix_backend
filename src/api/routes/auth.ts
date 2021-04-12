import express from 'express';
import authCtrl from '../controllers/auth';
import { userCheck } from '../middlewares/authorization';

const router = express.Router();

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.delete('/signout', userCheck, authCtrl.signout);

export default router;
