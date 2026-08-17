import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import Modal from '../../components/Modal';
import {
  PackageCheck,
  ChefHat,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  User,
  Phone,
  RotateCcw,
} from 'lucide-react';

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOrderToReject, setSelectedOrderToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000); // Polling
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/shop/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await api.patch(`/orders/${orderId}/shop-status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      setUpdating(true);
      await api.patch(`/orders/${selectedOrderToReject._id}/shop-status`, {
        status: 'Rejected',
        rejectionReason,
      });
      setRejectModalOpen(false);
      setRejectionReason('');
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter((o) =>
    statusFilter === 'All' ? true : o.status === statusFilter
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Shop Order Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Accept, prepare and track orders placed by students
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          'All',
          'Pending',
          'Accepted',
          'Preparing',
          'Ready',
          'Picked Up',
          'Delivered',
          'Rejected',
        ].map((tab) => {
          const count =
            tab === 'All'
              ? orders.length
              : orders.filter((o) => o.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No {statusFilter !== 'All' ? statusFilter : ''} orders
          </h3>
          <p className="text-xs text-slate-500">
            Orders matching this filter will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>

                <div className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Middle Section: Customer & Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Customer: {order.deliveryAddress?.name}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone: {order.deliveryAddress?.phone}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-orange-500" />
                    Destination: {order.deliveryAddress?.hostel} Hostel
                  </p>
                  <p className="text-slate-600">
                    Room: <strong>{order.deliveryAddress?.roomNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items Ordered
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {order.items?.map((it, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-800 border border-slate-200"
                    >
                      {it.quantity}× {it.name} (₹{it.price * it.quantity})
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm font-black text-slate-900">
                  Total Subtotal: <span className="text-orange-600">₹{order.subtotal}</span>
                </div>

                {/* Status Transitions */}
                <div className="flex items-center gap-2">
                  {order.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                        disabled={updating}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept Order
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderToReject(order);
                          setRejectModalOpen(true);
                        }}
                        disabled={updating}
                        className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject Order
                      </button>
                    </>
                  )}

                  {order.status === 'Accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                      disabled={updating}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <ChefHat className="w-3.5 h-3.5" /> Start Preparing
                    </button>
                  )}

                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Ready')}
                      disabled={updating}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Mark Ready for Rider
                    </button>
                  )}

                  {order.status === 'Ready' && (
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                      Waiting for delivery rider pickup
                    </span>
                  )}

                  {order.status === 'Picked Up' && (
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                      🚴 Out for delivery to hostel
                    </span>
                  )}

                  {order.status === 'Delivered' && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Order Completed & Delivered
                    </span>
                  )}

                  {order.status === 'Rejected' && (
                    <span className="text-xs text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                      Rejected: {order.rejectionReason}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REJECT MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Order — Reason Required"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Please specify why this order cannot be fulfilled. The reason will be sent to the student and items will be refunded to stock.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Rejection Reason
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Biryani finished / Kitchen closed for cleaning."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShopOrders;
