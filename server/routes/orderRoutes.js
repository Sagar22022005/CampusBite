import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getShopOrders,
  updateShopOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.get('/shop/orders', protect, authorize('shop_owner'), getShopOrders);
router.patch(
  '/:id/shop-status',
  protect,
  authorize('shop_owner'),
  updateShopOrderStatus
);
router.patch('/:id/cancel', protect, authorize('customer'), cancelOrder);
router.get('/:id', protect, getOrderById);

export default router;
