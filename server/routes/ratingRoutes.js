import express from 'express';
import { addRating, getShopRatings } from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/shop/:shopId', getShopRatings);
router.post('/', protect, authorize('customer'), addRating);

export default router;
