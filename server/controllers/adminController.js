import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Complaint from '../models/Complaint.js';

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingApprovals = await User.countDocuments({ status: 'pending' });
    const totalShops = await Shop.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });

    const deliveredOrders = await Order.find({ status: 'Delivered' });
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalShopPayout = deliveredOrders.reduce((sum, order) => sum + order.subtotal, 0);
    const totalDeliveryFees = deliveredOrders.reduce((sum, order) => sum + order.deliveryFee, 0);

    res.json({
      totalUsers,
      pendingApprovals,
      totalShops,
      totalProducts,
      totalOrders,
      pendingComplaints,
      totalRevenue,
      totalShopPayout,
      totalDeliveryFees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with optional filter
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject a user (Shop Owner / Delivery Partner)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({
      message: `User status successfully updated to ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also remove shops owned if shop owner
    if (user.role === 'shop_owner') {
      const shop = await Shop.findOne({ owner: user._id });
      if (shop) {
        await Product.deleteMany({ shop: shop._id });
        await Shop.findByIdAndDelete(shop._id);
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('shop', 'name category location')
      .populate('customer', 'name email phone hostel roomNumber')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a shop (Admin)
// @route   DELETE /api/admin/shops/:id
// @access  Private (Admin)
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    await Product.deleteMany({ shop: shop._id });
    await Shop.findByIdAndDelete(req.params.id);

    res.json({ message: 'Shop and its products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
