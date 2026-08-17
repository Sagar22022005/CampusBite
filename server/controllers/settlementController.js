import Settlement from '../models/Settlement.js';
import Order from '../models/Order.js';
import Shop from '../models/Shop.js';
import User from '../models/User.js';

// @desc    Get pending settlement calculations for shops, delivery partners, and cancelled order customer refunds
// @route   GET /api/settlements/summary
// @access  Private (Admin)
export const getSettlementSummary = async (req, res) => {
  try {
    // 1. Pending Shop Settlements
    const unsettledShopOrders = await Order.find({
      status: 'Delivered',
      isSettledShop: false,
    }).populate('shop', 'name category');

    const shopMap = {};
    unsettledShopOrders.forEach((order) => {
      if (!order.shop) return;
      const sId = order.shop._id.toString();
      if (!shopMap[sId]) {
        shopMap[sId] = {
          shopId: order.shop._id,
          shopName: order.shop.name,
          category: order.shop.category,
          totalAmount: 0,
          orderCount: 0,
          orders: [],
        };
      }
      shopMap[sId].totalAmount += order.subtotal;
      shopMap[sId].orderCount += 1;
      shopMap[sId].orders.push(order._id);
    });

    const pendingShops = Object.values(shopMap);

    // 2. Pending Delivery Partner Settlements
    const unsettledDeliveryOrders = await Order.find({
      status: 'Delivered',
      deliveryPartner: { $ne: null },
      isSettledDelivery: false,
    }).populate('deliveryPartner', 'name phone email');

    const partnerMap = {};
    unsettledDeliveryOrders.forEach((order) => {
      if (!order.deliveryPartner) return;
      const pId = order.deliveryPartner._id.toString();
      if (!partnerMap[pId]) {
        partnerMap[pId] = {
          partnerId: order.deliveryPartner._id,
          partnerName: order.deliveryPartner.name,
          partnerPhone: order.deliveryPartner.phone,
          totalAmount: 0,
          orderCount: 0,
          orders: [],
        };
      }
      partnerMap[pId].totalAmount += order.deliveryFee || 50;
      partnerMap[pId].orderCount += 1;
      partnerMap[pId].orders.push(order._id);
    });

    const pendingPartners = Object.values(partnerMap);

    // 3. Pending Customer Refunds (Cancelled Orders requiring full money return)
    const pendingRefundOrders = await Order.find({
      status: 'Cancelled',
      paymentStatus: 'Refund Due',
    })
      .populate('customer', 'name email phone hostel roomNumber')
      .populate('shop', 'name category')
      .sort({ cancelledAt: -1, createdAt: -1 });

    const pendingRefunds = pendingRefundOrders.map((o) => ({
      orderId: o._id,
      customer: o.customer,
      shopName: o.shop?.name || 'Campus Shop',
      totalAmount: o.total,
      cancellationReason: o.cancellationReason,
      cancelledAt: o.cancelledAt || o.updatedAt,
    }));

    res.json({
      pendingShops,
      pendingPartners,
      pendingRefunds,
      unsettledOrdersCount: unsettledShopOrders.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Execute a settlement for a shop, delivery partner, or process a customer refund
// @route   POST /api/settlements
// @access  Private (Admin)
export const createSettlement = async (req, res) => {
  try {
    const { settlementType, targetId, orderIds, totalAmount, notes } = req.body;

    if (!settlementType || !targetId || !orderIds || orderIds.length === 0) {
      return res.status(400).json({ message: 'Missing required settlement parameters' });
    }

    let settlementData = {
      settlementType,
      totalAmount: Number(totalAmount),
      orderCount: orderIds.length,
      orders: orderIds,
      settledBy: req.user._id,
      settledAt: new Date(),
      status: 'Settled',
      notes: notes || `Settlement for ${settlementType}`,
    };

    if (settlementType === 'shop') {
      settlementData.shop = targetId;
      // Mark orders as shop settled
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { isSettledShop: true } }
      );
    } else if (settlementType === 'delivery_partner') {
      settlementData.deliveryPartner = targetId;
      // Mark orders as delivery partner settled
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { isSettledDelivery: true } }
      );
    } else if (settlementType === 'customer_refund') {
      settlementData.customer = targetId;
      // Mark order as refunded with timestamp and ref
      await Order.updateMany(
        { _id: { $in: orderIds } },
        {
          $set: {
            paymentStatus: 'Refunded',
            refundedAt: new Date(),
            refundRef: notes || 'Bank Refund Disbursed by Admin',
          },
        }
      );
    }

    const settlement = await Settlement.create(settlementData);

    res.status(201).json({
      message: `${
        settlementType === 'shop'
          ? 'Shop'
          : settlementType === 'delivery_partner'
          ? 'Delivery Partner'
          : 'Customer refund'
      } settlement completed successfully!`,
      settlement,
    });
  } catch (error) {
    console.error('Create settlement error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get past settlement records
// @route   GET /api/settlements/history
// @access  Private (Admin)
export const getSettlementHistory = async (req, res) => {
  try {
    const settlements = await Settlement.find()
      .populate('shop', 'name category')
      .populate('deliveryPartner', 'name phone email')
      .populate('customer', 'name phone email')
      .populate('settledBy', 'name')
      .sort({ createdAt: -1 });

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
