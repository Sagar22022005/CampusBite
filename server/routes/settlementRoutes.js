import express from 'express';
import {
  getSettlementSummary,
  createSettlement,
  getSettlementHistory,
} from '../controllers/settlementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/summary', getSettlementSummary);
router.post('/', createSettlement);
router.get('/history', getSettlementHistory);

export default router;
