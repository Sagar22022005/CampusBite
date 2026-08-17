import express from 'express';
import {
  getShops,
  getShopById,
  getMyShop,
  saveMyShop,
  toggleShopStatus,
} from '../controllers/shopController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getShops);
router.get('/my/shop', protect, authorize('shop_owner'), getMyShop);
router.post(
  '/my/shop',
  protect,
  authorize('shop_owner'),
  upload.single('image'),
  saveMyShop
);
router.patch(
  '/my/toggle-status',
  protect,
  authorize('shop_owner'),
  toggleShopStatus
);
router.get('/:id', getShopById);

export default router;
