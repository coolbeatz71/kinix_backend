import express from 'express';
import adminArticleCtrl from '../controllers/admin/article';
import adminAuthCtrl from '../controllers/admin/auth';
import adminDashboardCtrl from '../controllers/admin/dashboard';
import adminVideoCtrl from '../controllers/admin/video';
import authCtrl from '../controllers/auth';
import { adminsCheck, superAdminCheck } from '../middlewares/authorization';

const router = express.Router();

/*
  |--------------------------------------------------------------------------
  | Auth ENDPOINTS
  |--------------------------------------------------------------------------
  |
  | Content all authentication endpoints for the admin or super admin
  |
*/
router.post('/auth', adminAuthCtrl.login);
router.get('/', adminsCheck, authCtrl.getCurrentUser);
router.delete('/signout', adminsCheck, authCtrl.signout);

/*
  |--------------------------------------------------------------------------
  | Video ENDPOINTS
  |--------------------------------------------------------------------------
  |
  | Content all video endpoints for the admin or super admin
  |
*/
router.post('/videos', adminsCheck, adminVideoCtrl.create);
router.get('/videos', adminsCheck, adminVideoCtrl.getAll);
router.get('/videos/:slug', adminsCheck, adminVideoCtrl.get);
router.put('/videos/:slug', adminsCheck, adminVideoCtrl.update);

// super admin
router.put('/videos/approve/:slug', superAdminCheck, adminVideoCtrl.approve);
router.delete('/videos/:slug', superAdminCheck, adminVideoCtrl.delete);

/*
  |--------------------------------------------------------------------------
  | Article ENDPOINTS
  |--------------------------------------------------------------------------
  |
  | Content all article endpoints for the admin or super admin
  |
*/
router.post('/articles', adminsCheck, adminArticleCtrl.create);
router.get('/articles', adminsCheck, adminArticleCtrl.getAll);
router.get('/articles/:slug', adminsCheck, adminArticleCtrl.get);
router.put('/articles/:slug', adminsCheck, adminArticleCtrl.update);

/*
  |--------------------------------------------------------------------------
  | dashboard ENDPOINTS
  |--------------------------------------------------------------------------
  |
  | Content all dashboard endpoints for the admin or super admin
  |
*/
router.get('/overview', adminsCheck, adminDashboardCtrl.getOverview);

// super admin
router.put('/articles/approve/:slug', superAdminCheck, adminArticleCtrl.approve);
router.delete('/articles/:slug', superAdminCheck, adminArticleCtrl.delete);

export default router;
