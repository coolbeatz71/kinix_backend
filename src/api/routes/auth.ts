import express from 'express';
import authCtrl from '../controllers/auth';
import { userCheck, verifyToken } from '../middlewares/authorization';

const router = express.Router();

router.post('/login', authCtrl.login);
router.post('/signup', authCtrl.signup);
router.put('/update', verifyToken, authCtrl.update);
router.delete('/signout', userCheck, authCtrl.signout);
router.get('/user', userCheck, authCtrl.getCurrentUser);
router.put('/update/avatar', verifyToken, authCtrl.updateAvatar);
router.put('/update/password', verifyToken, authCtrl.changePassword);

router.post('/confirm', authCtrl.confirmAccount);
router.post('/resend-otp', authCtrl.resentOtpCode);
router.post('/social-login', authCtrl.socialLogin);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

export default router;
