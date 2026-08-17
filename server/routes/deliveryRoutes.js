import express from 'express';
import {
  getAvailableDeliveries,
  acceptDelivery,
  getActiveDeliveries,
  updateDeliveryStatus,
  getDeliveryHistory,
} from '../controllers/deliveryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('delivery_partner'));

router.get('/available', getAvailableDeliveries);
router.patch('/:id/accept', acceptDelivery);
router.get('/active', getActiveDeliveries);
router.patch('/:id/status', updateDeliveryStatus);
router.get('/history', getDeliveryHistory);

export default router;
