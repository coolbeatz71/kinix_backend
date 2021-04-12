import express from 'express';
import authCtrl from '../controllers/auth';
import { adminsCheck, superAdminCheck } from '../middlewares/authorization';

const router = express.Router();

/*
  |--------------------------------------------------------------------------
  | Video ENDPOINTS
  |--------------------------------------------------------------------------
  |
  | Content all video endpoints for the admin or super admin
  |
*/
router.post('/videos', adminsCheck, authCtrl.signup);
router.put('/videos', adminsCheck, authCtrl.login);
router.put('/videos/:slug', adminsCheck, authCtrl.login);

// super admin
router.put('/videos/approve/:slug', superAdminCheck, authCtrl.login);
router.delete('/videos/:slug', superAdminCheck, authCtrl.login);

export default router;
