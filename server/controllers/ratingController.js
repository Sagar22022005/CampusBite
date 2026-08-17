import Rating from '../models/Rating.js';
import Order from '../models/Order.js';
import Shop from '../models/Shop.js';

// @desc    Submit rating and review for a delivered order
// @route   POST /api/ratings
// @access  Private (Customer)
export const addRating = async (req, res) => {
  try {
    const { orderId, rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5 stars' });
    }

    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'You can only rate orders that have been delivered' });
    }

    if (order.isRated) {
      return res.status(400).json({ message: 'This order has already been rated' });
    }

    const newRating = await Rating.create({
      shop: order.shop,
      customer: req.user._id,
      order: order._id,
      rating: Number(rating),
      review: review || '',
    });

    order.isRated = true;
    await order.save();

    // Recalculate Shop Average Rating
    const allRatings = await Rating.find({ shop: order.shop });
    const avgRating =
      allRatings.reduce((acc, item) => item.rating + acc, 0) / allRatings.length;

    await Shop.findByIdAndUpdate(order.shop, {
      rating: Number(avgRating.toFixed(1)),
      numRatings: allRatings.length,
    });

    res.status(201).json({
      message: 'Rating and review submitted successfully!',
      rating: newRating,
      newAverage: Number(avgRating.toFixed(1)),
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a shop
// @route   GET /api/ratings/shop/:shopId
// @access  Public
export const getShopRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ shop: req.params.shopId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
