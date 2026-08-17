import Complaint from '../models/Complaint.js';
import Shop from '../models/Shop.js';

// @desc    Submit a complaint (by Customer to Shop/Admin, or by Shop Owner to Admin)
// @route   POST /api/complaints
// @access  Private (Customer, Shop Owner)
export const createComplaint = async (req, res) => {
  try {
    const { target, shopId, orderId, subject, message } = req.body;

    if (!target || !['shop_owner', 'admin'].includes(target)) {
      return res.status(400).json({ message: 'Valid target (shop_owner or admin) is required' });
    }

    if (!message) {
      return res.status(400).json({ message: 'Complaint message is required' });
    }

    let linkedShop = shopId || null;

    // If shop owner is creating a complaint to admin, attach their shop
    if (req.user.role === 'shop_owner' && !linkedShop) {
      const myShop = await Shop.findOne({ owner: req.user._id });
      if (myShop) linkedShop = myShop._id;
    }

    if (target === 'shop_owner' && !linkedShop) {
      return res.status(400).json({ message: 'Please select a shop for shop owner complaint' });
    }

    const complaint = await Complaint.create({
      customer: req.user._id,
      target,
      shop: linkedShop,
      order: orderId || null,
      subject: subject || 'General Complaint / Issue',
      message,
      status: 'Pending',
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('shop', 'name category')
      .populate('customer', 'name email phone role');

    res.status(201).json({
      message: 'Complaint submitted successfully!',
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's submitted complaints
// @route   GET /api/complaints/my
// @access  Private
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ customer: req.user._id })
      .populate('shop', 'name category')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints for shop owner (incoming customer complaints + outgoing admin tickets)
// @route   GET /api/complaints/shop
// @access  Private (Shop Owner)
export const getShopComplaints = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop profile not found' });
    }

    // Customer complaints targeted to this shop
    const incomingComplaints = await Complaint.find({
      target: 'shop_owner',
      shop: shop._id,
    })
      .populate('customer', 'name email phone hostel roomNumber')
      .populate('order', 'total status createdAt')
      .sort({ createdAt: -1 });

    // Outgoing tickets submitted by this shop owner to Admin
    const outgoingTickets = await Complaint.find({
      target: 'admin',
      customer: req.user._id,
    })
      .populate('shop', 'name category')
      .sort({ createdAt: -1 });

    res.json({
      incoming: incomingComplaints,
      outgoing: outgoingTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints for Admin
// @route   GET /api/complaints/admin
// @access  Private (Admin)
export const getAdminComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('customer', 'name email phone hostel roomNumber')
      .populate('shop', 'name category')
      .populate('order', 'total status')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve complaint with response
// @route   PATCH /api/complaints/:id/resolve
// @access  Private (Shop Owner or Admin)
export const resolveComplaint = async (req, res) => {
  try {
    const { response } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Role check if shop owner
    if (req.user.role === 'shop_owner') {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop || complaint.shop.toString() !== shop._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to resolve this complaint' });
      }
    }

    complaint.status = 'Resolved';
    complaint.response = response || 'Complaint resolved by manager.';
    complaint.resolvedAt = new Date();

    await complaint.save();

    res.json({
      message: 'Complaint marked as resolved',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
