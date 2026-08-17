import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import OrderTracker from '../../components/OrderTracker';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import {
  ArrowLeft,
  Store,
  Bike,
  Building,
  Phone,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  ShieldAlert,
  Send,
} from 'lucide-react';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating Modal state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Cancellation Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind / Ordered by mistake');
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 6000); // Polling for live status updates
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    try {
      setCancellingOrder(true);
      const res = await api.patch(`/orders/${order._id}/cancel`, {
        reason: cancelReason,
      });
      setCancelSuccessMsg(res.data.message);
      fetchOrder();
      setTimeout(() => {
        setIsCancelModalOpen(false);
        setCancelSuccessMsg('');
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRating(true);
    try {
      await api.post('/ratings', {
        orderId: order._id,
        rating: ratingVal,
        review: reviewText,
      });
      alert('Thank you for rating this shop!');
      setIsRatingModalOpen(false);
      fetchOrder();
    } catch (err) {
      alert(`Rating failed: ${err.message}`);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not load order tracking details.'}</p>
        <Link to="/orders" className="text-xs font-bold text-orange-600">
          View All Orders
        </Link>
      </div>
    );
  }

  const isPending = order.status === 'Pending';
  const isAcceptedOrBeyond = ['Accepted', 'Preparing', 'Ready', 'Picked Up', 'Delivered'].includes(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> All Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Track Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Cancel Button if Still Pending */}
          {isPending && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-sm"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              Cancel Order (Refund)
            </button>
          )}

          <button
            onClick={fetchOrder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Cancellation Notice or Disabled Info Banner */}
      {isPending && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Order is pending shop owner acceptance. You can cancel now for a 100% full money refund.</span>
          </div>
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="text-xs font-black text-rose-700 hover:underline whitespace-nowrap"
          >
            Cancel Now ➔
          </button>
        </div>
      )}

      {isAcceptedOrBeyond && order.status !== 'Delivered' && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Shop has accepted your order. Cancellation is disabled as food preparation has started.</span>
        </div>
      )}

      {/* Visual Live Tracker Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
          Live Order Timeline
        </h2>
        <OrderTracker
          status={order.status}
          rejectionReason={order.rejectionReason}
        />
      </div>

      {/* Action Banner for Delivered Orders (Rating) */}
      {order.status === 'Delivered' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              How was your meal from {order.shop?.name}?
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Help other students in your hostel by leaving a quick star rating & review.
            </p>
          </div>

          {order.isRated ? (
            <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rated & Reviewed
            </span>
          ) : (
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all whitespace-nowrap"
            >
              Rate Shop ⭐
            </button>
          )}
        </div>
      )}

      {/* Order Info & Delivery Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop & Partner Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Fulfillment Info
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {order.shop?.name}
              </h4>
              <p className="text-xs text-slate-500">{order.shop?.category} • IIT Indore</p>
              {order.shop?.phone && (
                <a
                  href={`tel:${order.shop.phone}`}
                  className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3 h-3" /> Call Canteen: {order.shop.phone}
                </a>
              )}
            </div>
          </div>

          {/* Delivery Rider Section */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Delivery Assignment
            </p>
            {order.deliveryPartner ? (
              <div className="flex items-center justify-between p-3 bg-teal-50/70 border border-teal-200 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {order.deliveryPartner.name}
                    </p>
                    <p className="text-[10px] text-teal-800 font-medium">
                      Campus Delivery Partner
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryPartner.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call Rider
                </a>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {isCancelled
                  ? 'Order cancelled before pickup.'
                  : 'Awaiting pickup by an approved campus delivery partner...'}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address & Hostel Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Hostel Destination
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mt-0.5">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {order.deliveryAddress?.hostel} Hostel
              </h4>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                Room: <span className="text-orange-600">{order.deliveryAddress?.roomNumber}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Recipient: {order.deliveryAddress?.name} ({order.deliveryAddress?.phone})
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Payment Status:</span>
              <span
                className={`font-black ${
                  order.paymentStatus === 'Paid'
                    ? 'text-emerald-600'
                    : order.paymentStatus === 'Refund Due'
                    ? 'text-amber-600'
                    : 'text-purple-600'
                }`}
              >
                {order.paymentStatus === 'Paid'
                  ? '✅ Paid (Dummy Gateway)'
                  : order.paymentStatus === 'Refund Due'
                  ? '⏳ Refund Due (Admin Settlement)'
                  : '💰 Refunded to Account'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Order Summary & Receipt
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-black flex items-center justify-center text-xs">
                  {item.quantity}×
                </span>
                <span className="font-semibold text-slate-800">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Items Subtotal:</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Campus Delivery Fee:</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Paid:</span>
            <span className="text-orange-600">₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* RATING MODAL */}
      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title={`Rate your meal from ${order.shop?.name}`}
      >
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <div className="text-center py-2 space-y-2">
            <p className="text-xs text-slate-500">
              Tap stars to select your rating (1 = Poor, 5 = Excellent):
            </p>
            <div className="flex justify-center">
              <StarRating
                rating={ratingVal}
                interactive={true}
                onRate={(newRating) => setRatingVal(newRating)}
                size="lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Delicious biryani, delivered hot and packed neatly!"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRatingModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingRating}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
            >
              {submittingRating ? 'Submitting...' : 'Submit Rating ⭐'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CANCELLATION & REFUND MODAL */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={`Cancel Order #${order._id.slice(-6).toUpperCase()}`}
      >
        {cancelSuccessMsg ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">{cancelSuccessMsg}</h3>
            <p className="text-xs text-slate-500">
              Admin will disburse the full refund of ₹{order.total} during day-end financial settlements.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCancelOrder} className="space-y-4">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1 text-center">
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Full Refund Amount
              </p>
              <p className="text-3xl font-black text-rose-600">
                ₹{order.total}
              </p>
              <p className="text-xs text-rose-700">
                Includes food items (₹{order.subtotal}) + Delivery fee (₹{order.deliveryFee})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
              >
                <option value="Changed mind / Ordered by mistake">Changed mind / Ordered by mistake</option>
                <option value="Need to change delivery hostel or room">Need to change delivery hostel or room</option>
                <option value="Want to order different dishes">Want to order different dishes</option>
                <option value="Taking too long to accept">Taking too long to accept</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500">
              ⚠️ You can only cancel while the status is <strong>Pending</strong>. Once the kitchen accepts, cancellation is disabled.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Keep Order
              </button>
              <button
                type="submit"
                disabled={cancellingOrder}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                {cancellingOrder ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TrackOrder;
