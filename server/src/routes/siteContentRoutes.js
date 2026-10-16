import {Router} from 'express';
import {getSiteContent,updateSiteContent} from '../controllers/siteContentController.js';
import requireAdmin from '../middleware/requireAdmin.js';
import {asyncHandler} from '../utils/asyncHandler.js';
const router=Router();router.get('/',asyncHandler(getSiteContent));router.put('/',requireAdmin,asyncHandler(updateSiteContent));export default router;
