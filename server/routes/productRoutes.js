import express from 'express';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByShop,
  searchProducts,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/shop/:shopId', getProductsByShop);

router.post(
  '/',
  protect,
  authorize('shop_owner'),
  upload.single('image'),
  addProduct
);

router.put(
  '/:id',
  protect,
  authorize('shop_owner'),
  upload.single('image'),
  updateProduct
);

router.delete('/:id', protect, authorize('shop_owner'), deleteProduct);

export default router;
