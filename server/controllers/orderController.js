import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

// @desc    Create new order with dummy payment & stock deduction
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res) => {
  try {
    const { shopId, items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty, no order items' });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.hostel ||
      !deliveryAddress.roomNumber
    ) {
      return res.status(400).json({ message: 'Complete delivery address is required' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (!shop.isOpen) {
      return res.status(400).json({ message: 'This shop is currently closed for orders' });
    }

    // Verify each product, price, and available stock
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insufficient for ${product.name}. Only ${product.stock} items are available.`,
        });
      }

      subtotal += product.price * item.quantity;
      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // Deduct stock
    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      product.stock -= item.quantity;
      if (product.stock <= 0) {
        product.stock = 0;
        product.isAvailable = false;
      }
      await product.save();
    }

    const deliveryFee = 50; // Standard campus delivery fee
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customer: req.user._id,
      shop: shop._id,
      items: verifiedItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentStatus: 'Paid', // Dummy payment recorded as successful
      status: 'Pending',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('shop', 'name category image location')
      .populate('customer', 'name email phone');

    res.status(201).json({
      message: 'Dummy Payment Successful! Order created.',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/my
// @access  Private (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('shop', 'name category image location')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('shop', 'name category image location phone')
      .populate('customer', 'name email phone hostel roomNumber')
      .populate('deliveryPartner', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for the logged-in shop owner
// @route   GET /api/orders/shop/orders
// @access  Private (Shop Owner)
export const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop profile not found' });
    }

    const orders = await Order.find({ shop: shop._id })
      .populate('customer', 'name email phone hostel roomNumber')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Shop owner updates order status (Accept, Preparing, Ready, Reject)
// @route   PATCH /api/orders/:id/shop-status
// @access  Private (Shop Owner)
export const updateShopOrderStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const order = await Order.findOne({ _id: req.params.id, shop: shop._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'Rejected') {
      if (!rejectionReason) {
        return res.status(400).json({ message: 'Please provide a reason for rejection' });
      }
      order.status = 'Rejected';
      order.rejectionReason = rejectionReason;

      // Refund stock back
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.isAvailable = true;
          await product.save();
        }
      }
    } else if (['Accepted', 'Preparing', 'Ready'].includes(status)) {
      order.status = status;
    } else {
      return res.status(400).json({ message: 'Invalid status update for shop' });
    }

    await order.save();
    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('shop', 'name category');

    res.json({ message: `Order status updated to ${order.status}`, order: updatedOrder });
  } catch (error) {
    console.error('Update shop order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Customer cancels order before shop acceptance (triggers stock refund & Admin refund queue)
// @route   PATCH /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure only the owner customer can cancel their order
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Cancellation is strictly permitted only while status is 'Pending'
    if (order.status !== 'Pending') {
      return res.status(400).json({
        message:
          'Cannot cancel order. The shop owner has already accepted and started preparing your order.',
      });
    }

    order.status = 'Cancelled';
    order.cancellationReason = reason || 'Cancelled by student before shop owner acceptance';
    order.cancelledAt = new Date();
    order.paymentStatus = 'Refund Due';

    // Restore inventory stock back to each product
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.isAvailable = true;
        await product.save();
      }
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('shop', 'name category image location phone')
      .populate('customer', 'name email phone hostel roomNumber');

    res.json({
      message: `Order cancelled successfully. A full refund of ₹${order.total} has been scheduled for Admin settlement.`,
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: error.message });
  }
};
