import express from 'express';
import adminArticleCtrl from '../controllers/admin/article';
import adminAuthCtrl from '../controllers/admin/auth';
import adminDashboardCtrl from '../controllers/admin/dashboard';
import adminPromotionCtrl from '../controllers/admin/promotion';
import adminUserCtrl from '../controllers/admin/user';
import adminVideoCtrl from '../controllers/admin/video';
import authCtrl from '../controllers/auth';
import { adminsCheck, superAdminCheck } from '../middlewares/authorization';

const router = express.Router();

/*
  |--------------------------------------------------------------------------
  | Auth ENDPOINTS
  |--------------------------------------------------------------------------
  | Content all authentication endpoints for the admin or super admin
*/
router.post('/auth', adminAuthCtrl.login);
router.get('/', adminsCheck, authCtrl.getCurrentUser);
router.delete('/signout', adminsCheck, authCtrl.signout);

/*
  |--------------------------------------------------------------------------
  | Video ENDPOINTS
  |--------------------------------------------------------------------------
  | Content all video endpoints for the admin or super admin
*/
router.post('/videos', adminsCheck, adminVideoCtrl.create);
router.get('/videos', adminsCheck, adminVideoCtrl.getAll);
router.get('/videos/:slug', adminsCheck, adminVideoCtrl.get);
router.put('/videos/:slug', adminsCheck, adminVideoCtrl.update);
// super admin
router.put('/videos/approve/:slug', superAdminCheck, adminVideoCtrl.approve);
router.put('/videos/disable/:slug', superAdminCheck, adminVideoCtrl.disable);
router.delete('/videos/:slug', superAdminCheck, adminVideoCtrl.delete);

/*
  |--------------------------------------------------------------------------
  | Article ENDPOINTS
  |--------------------------------------------------------------------------
  | Content all article endpoints for the admin or super admin
*/
router.post('/articles', adminsCheck, adminArticleCtrl.create);
router.get('/articles', adminsCheck, adminArticleCtrl.getAll);
router.get('/articles/:slug', adminsCheck, adminArticleCtrl.get);
router.put('/articles/:slug', adminsCheck, adminArticleCtrl.update);
// super admin
router.put('/articles/approve/:slug', superAdminCheck, adminArticleCtrl.approve);
router.put('/articles/disable/:slug', superAdminCheck, adminArticleCtrl.disable);
router.delete('/articles/:slug', superAdminCheck, adminArticleCtrl.delete);

/*
  |--------------------------------------------------------------------------
  | dashboard ENDPOINTS
  |--------------------------------------------------------------------------
  | Content all dashboard endpoints for the admin or super admin
*/
router.get('/overview', adminsCheck, adminDashboardCtrl.getOverview);

/*
  |--------------------------------------------------------------------------
  | User ENDPOINTS
  |--------------------------------------------------------------------------
  | Content all users endpoints for the admin or super admin
*/
router.get('/users', adminsCheck, adminUserCtrl.getAllUsers);
router.post('/users', adminsCheck, adminUserCtrl.createAccount);
router.put('/users/:id', adminsCheck, adminUserCtrl.updateAccount);
router.get('/clients', adminsCheck, adminUserCtrl.getAllClients);
router.put('/users/block/:id', adminsCheck, adminUserCtrl.block);
router.put('/users/unblock/:id', adminsCheck, adminUserCtrl.unblock);
// super admin
router.delete('/users/:id', superAdminCheck, adminUserCtrl.delete);
router.get('/admins', superAdminCheck, adminUserCtrl.getAllAdmins);

/*
  |--------------------------------------------------------------------------
  | Promotion ENDPOINTS
  |--------------------------------------------------------------------------
  | Content all promotions endpoints for super admin
*/
router.post('/promotion/ads', superAdminCheck, adminPromotionCtrl.createAdsPlan);
router.post('/promotion/story', superAdminCheck, adminPromotionCtrl.createStoryPlan);
router.put('/promotion/ads/:id', superAdminCheck, adminPromotionCtrl.updateAdsPlan);
router.put('/promotion/story/:id', superAdminCheck, adminPromotionCtrl.updateStoryPlan);

export default router;
