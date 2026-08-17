import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getShopComplaints,
  getAdminComplaints,
  resolveComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('customer', 'shop_owner', 'delivery_partner'), createComplaint);
router.get('/my', authorize('customer', 'shop_owner', 'delivery_partner'), getMyComplaints);
router.get('/shop', authorize('shop_owner'), getShopComplaints);
router.get('/admin', authorize('admin'), getAdminComplaints);
router.patch('/:id/resolve', authorize('shop_owner', 'admin'), resolveComplaint);

export default router;
