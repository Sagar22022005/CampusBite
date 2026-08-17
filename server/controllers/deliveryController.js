import Order from '../models/Order.js';

// @desc    Get available orders for delivery (Privacy Protected)
// @route   GET /api/delivery/available
// @access  Private (Delivery Partner)
export const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: null,
      status: { $in: ['Accepted', 'Preparing', 'Ready'] },
    })
      .populate('shop', 'name location image category')
      .sort({ createdAt: -1 });

    // Privacy Protection: Hide customer name and phone number until accepted
    const anonymizedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.deliveryAddress = {
        hostel: order.deliveryAddress.hostel,
        // name and phone hidden for privacy
        name: '🔒 Hidden until accepted',
        phone: '🔒 Hidden until accepted',
        roomNumber: '🔒 Hidden until accepted',
      };
      // customer info hidden
      delete orderObj.customer;
      return orderObj;
    });

    res.json(anonymizedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept/Claim delivery order atomically (First come, first served)
// @route   PATCH /api/delivery/:id/accept
// @access  Private (Delivery Partner)
export const acceptDelivery = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Atomic update ensures only the first partner can claim it
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        deliveryPartner: null,
        status: { $in: ['Accepted', 'Preparing', 'Ready'] },
      },
      {
        deliveryPartner: req.user._id,
      },
      { new: true }
    )
      .populate('shop', 'name location category image phone')
      .populate('customer', 'name phone email');

    if (!order) {
      return res.status(400).json({
        message: 'Order is no longer available. It may have been claimed by another delivery partner.',
      });
    }

    res.json({
      message: 'Delivery accepted successfully! Customer contact details are now revealed.',
      order,
    });
  } catch (error) {
    console.error('Accept delivery error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active deliveries for logged in delivery partner
// @route   GET /api/delivery/active
// @access  Private (Delivery Partner)
export const getActiveDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
      status: { $in: ['Accepted', 'Preparing', 'Ready', 'Picked Up'] },
    })
      .populate('shop', 'name location category image phone')
      .populate('customer', 'name phone email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery progress (Picked Up, Delivered)
// @route   PATCH /api/delivery/:id/status
// @access  Private (Delivery Partner)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartner: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not assigned to you' });
    }

    if (!['Picked Up', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status update' });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('shop', 'name location category')
      .populate('customer', 'name phone email');

    res.json({
      message: `Delivery status updated to: ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get delivery history & earnings
// @route   GET /api/delivery/history
// @access  Private (Delivery Partner)
export const getDeliveryHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
      status: 'Delivered',
    })
      .populate('shop', 'name location category')
      .populate('customer', 'name phone')
      .sort({ updatedAt: -1 });

    const totalEarnings = orders.length * 50; // ₹50 delivery fee per order

    res.json({
      totalDeliveries: orders.length,
      totalEarnings,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
