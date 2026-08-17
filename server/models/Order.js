import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 50,
    },
    total: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      hostel: {
        type: String,
        enum: [
          'CVR',
          'VSB',
          'APJ',
          'DA',
          'HJB',
          'LRC',
          'Sports Complex',
          'Takshashila Complex',
          'JC Bose',
          'Amul',
          'Kendriya Vidyalaya',
          'Other',
        ],
        required: true,
      },
      roomNumber: { type: String, required: true },
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Refund Due', 'Refunded'],
      default: 'Paid',
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Preparing',
        'Ready',
        'Picked Up',
        'Delivered',
        'Rejected',
        'Cancelled',
      ],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundRef: {
      type: String,
      default: '',
    },
    isRated: {
      type: Boolean,
      default: false,
    },
    isSettledShop: {
      type: Boolean,
      default: false,
    },
    isSettledDelivery: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
