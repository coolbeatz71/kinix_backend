import express from 'express';
import adminArticleCtrl from '../controllers/admin-article';
import adminVideoCtrl from '../controllers/admin-video';
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

// super admin
router.put('/articles/approve/:slug', superAdminCheck, adminArticleCtrl.approve);
router.delete('/articles/:slug', superAdminCheck, adminArticleCtrl.delete);

export default router;
