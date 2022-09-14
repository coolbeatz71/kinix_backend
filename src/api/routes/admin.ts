import express from 'express';
import adminAdsCtrl from '../controllers/admin/ads';
import adminArticleCtrl from '../controllers/admin/article';
import adminAuthCtrl from '../controllers/admin/auth';
import adminDashboardCtrl from '../controllers/admin/dashboard';
import adminStoryCtrl from '../controllers/admin/story';
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
// subscription plan
router.post('/promotions/plan/ads', superAdminCheck, adminAdsCtrl.createPlan);
router.put('/promotions/plan/ads/:id', superAdminCheck, adminAdsCtrl.updatePlan);

router.post('/promotions/plan/story', superAdminCheck, adminStoryCtrl.createPlan);
router.put('/promotions/plan/story/:id', superAdminCheck, adminStoryCtrl.updatePlan);
// ads and story
router.post('/promotions/ads', superAdminCheck, adminAdsCtrl.create);
router.put('/promotions/ads/:id', superAdminCheck, adminAdsCtrl.update);
router.delete('/promotions/ads/:id', superAdminCheck, adminAdsCtrl.delete);

router.post('/promotions/story', superAdminCheck, adminStoryCtrl.create);
router.put('/promotions/story/:id', superAdminCheck, adminStoryCtrl.update);
router.delete('/promotions/story/:id', superAdminCheck, adminStoryCtrl.delete);

router.put('/promotions/ads/enable/:id', superAdminCheck, adminAdsCtrl.enable);
router.put('/promotions/ads/disable/:id', superAdminCheck, adminAdsCtrl.disable);

router.put('/promotions/story/enable/:id', superAdminCheck, adminStoryCtrl.enable);
router.put('/promotions/story/disable/:id', superAdminCheck, adminStoryCtrl.disable);

router.get('/promotions/ads', superAdminCheck, adminAdsCtrl.getAll);
router.get('/promotions/story', superAdminCheck, adminStoryCtrl.getAll);

router.get('/overview/ads', superAdminCheck, adminDashboardCtrl.getAdsOverview);
router.get('/overview/story', superAdminCheck, adminDashboardCtrl.getStoryOverview);

export default router;
