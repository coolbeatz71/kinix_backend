import express from 'express';
import authCtrl from '../controllers/auth';
import videoCtrl from '../controllers/video';
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
router.post('/videos', adminsCheck, videoCtrl.create);
router.put('/videos/:slug', adminsCheck, videoCtrl.update);

// super admin
router.put('/videos/approve/:slug', superAdminCheck, authCtrl.login);
router.delete('/videos/:slug', superAdminCheck, authCtrl.login);

export default router;
