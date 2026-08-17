import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import Modal from '../../components/Modal';
import {
  ShoppingBag,
  ArrowRight,
  Clock,
  Store,
  MapPin,
  HelpCircle,
  ShieldAlert,
  Send,
  CheckCircle2,
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Complaint Modal State
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [complaintTarget, setComplaintTarget] = useState('shop_owner');
  const [complaintSubject, setComplaintSubject] = useState('Missing Item / Wrong Order');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenComplaint = (order) => {
    setSelectedOrder(order);
    setComplaintTarget('shop_owner');
    setComplaintSubject('Missing Item / Order Quality Issue');
    setComplaintMessage('');
    setComplaintSuccess('');
    setComplaintModalOpen(true);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintMessage.trim()) {
      alert('Please describe your issue with the order.');
      return;
    }

    try {
      setSubmittingComplaint(true);
      await api.post('/complaints', {
        target: complaintTarget,
        shopId: complaintTarget === 'shop_owner' ? selectedOrder.shop?._id : undefined,
        orderId: selectedOrder._id,
        subject: `[Order #${selectedOrder._id.slice(-6).toUpperCase()}] ${complaintSubject}`,
        message: complaintMessage,
      });

      setComplaintSuccess(
        complaintTarget === 'shop_owner'
          ? `✅ Complaint sent directly to ${selectedOrder.shop?.name} dashboard!`
          : `✅ Complaint sent directly to CampusBite Admin!`
      );
      setComplaintMessage('');
      setTimeout(() => {
        setComplaintModalOpen(false);
        setComplaintSuccess('');
      }, 2500);
    } catch (err) {
      alert(err.message || 'Failed to submit complaint');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your Campus Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            History of all your meals, groceries, and fruit deliveries
          </p>
        </div>

        <Link
          to="/help"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-rose-600" />
          General Help & Complaints
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No orders placed yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to order something tasty? Explore our campus canteens and stores.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md hover:bg-orange-600 transition-colors"
          >
            Start Ordering
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {order.shop?.name || 'Campus Shop'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      #{order._id.slice(-6).toUpperCase()} •{' '}
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} size="sm" />
                  <span className="text-base font-black text-slate-900">
                    ₹{order.total}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-medium"
                    >
                      {item.quantity}× {item.name}
                    </span>
                  ))}
                </div>

                {/* Actions: Track Order + Report Issue */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenComplaint(order)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Report Issue
                  </button>

                  <Link
                    to={`/orders/track/${order._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Track Order
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPLAINT MODAL FOR SPECIFIC ORDER */}
      <Modal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        title={`Report Issue: Order #${selectedOrder?._id.slice(-6).toUpperCase()}`}
      >
        {complaintSuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">{complaintSuccess}</h3>
            <p className="text-xs text-slate-500">
              You can track all ticket responses anytime in the Help & Complaints page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Direct this issue to the shop owner or campus administrator:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setComplaintTarget('shop_owner')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  complaintTarget === 'shop_owner'
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-black text-slate-900">
                    🏪 {selectedOrder?.shop?.name || 'Shop Owner'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Food quality, missing dish, packaging spill, or incorrect item.
                </p>
              </label>

              <label
                onClick={() => setComplaintTarget('admin')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  complaintTarget === 'admin'
                    ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-slate-900">
                    👑 Campus Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Billing issues, rider behavior, extreme delay, or refund dispute.
                </p>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issue Type
              </label>
              <select
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
              >
                <option value="Missing Item / Incomplete Order">Missing Item / Incomplete Order</option>
                <option value="Food Quality / Taste / Temperature">Food Quality / Taste / Temperature</option>
                <option value="Packaging Damaged / Spilled">Packaging Damaged / Spilled</option>
                <option value="Severe Delivery Delay">Severe Delivery Delay</option>
                <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                <option value="Other Order Complaint">Other Order Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain what was wrong with this order..."
                value={complaintMessage}
                onChange={(e) => setComplaintMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setComplaintModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingComplaint}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {submittingComplaint ? 'Sending...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
