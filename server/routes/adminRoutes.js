import express from 'express';
import {
  getAdminStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  deleteShop,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.delete('/shops/:id', deleteShop);

export default router;
