import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import Modal from '../../components/Modal';
import {
  Store,
  DollarSign,
  Clock,
  PackageCheck,
  TrendingUp,
  AlertCircle,
  Plus,
  CheckCircle2,
  XCircle,
  ChefHat,
  ArrowRight,
  Power,
} from 'lucide-react';

const ShopDashboard = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOrderToReject, setSelectedOrderToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const [shopRes, ordersRes] = await Promise.all([
        api.get('/shops/my/shop'),
        api.get('/orders/shop/orders'),
      ]);
      setShop(shopRes.data.shop);
      setProducts(shopRes.data.products || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await api.patch('/shops/my/toggle-status');
      setShop({ ...shop, isOpen: res.data.isOpen });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await api.patch(`/orders/${orderId}/shop-status`, { status: newStatus });
      fetchShopData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason) {
      alert('Please provide a reason for rejecting the order');
      return;
    }
    try {
      setUpdatingStatus(true);
      await api.patch(`/orders/${selectedOrderToReject._id}/shop-status`, {
        status: 'Rejected',
        rejectionReason,
      });
      setRejectModalOpen(false);
      setRejectionReason('');
      fetchShopData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
        <Store className="w-12 h-12 text-orange-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No Shop Profile Found</h2>
        <p className="text-xs text-slate-500">
          Create your shop profile to start listing dishes & receiving hostel orders.
        </p>
        <Link
          to="/shop/my-shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md"
        >
          Create Shop Profile
        </Link>
      </div>
    );
  }

  // Calculate Metrics
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const activeOrders = orders.filter((o) =>
    ['Accepted', 'Preparing', 'Ready'].includes(o.status)
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner with Open/Close Toggle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-16 h-16 object-cover rounded-2xl border border-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {shop.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                {shop.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rating: <strong>{shop.rating > 0 ? `${shop.rating} ⭐` : 'No ratings yet'}</strong> ({shop.numRatings} reviews)
            </p>
          </div>
        </div>

        {/* Action Controls & Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/shop/complaints"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-purple-600" />
            🆘 Raise Ticket to Admin
          </Link>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-xl ${
                shop.isOpen
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
            </span>
            <button
              onClick={handleToggleStatus}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <Power className="w-3.5 h-3.5 text-orange-400" />
              {shop.isOpen ? 'Close' : 'Open'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Food Sales
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{totalRevenue}
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {deliveredOrders.length} orders delivered
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              New Pending Orders
            </p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {pendingOrders.length}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Requires accept / reject
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In-Kitchen / Active
            </p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">
              {activeOrders.length}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Preparing or ready
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Menu Items
            </p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">
              {products.length}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Active in catalog
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Live Incoming Orders
            </h2>
            <p className="text-xs text-slate-500">
              Review new orders and advance kitchen preparation status
            </p>
          </div>
          <Link
            to="/shop/orders"
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            View All ({orders.length}) ➔
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No customer orders received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black text-slate-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500">
                    Hostel: <strong className="text-slate-800">{order.deliveryAddress?.hostel}</strong> (Room {order.deliveryAddress?.roomNumber})
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {order.items?.map((it, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-slate-800"
                    >
                      {it.quantity}× {it.name} (₹{it.price * it.quantity})
                    </span>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-black text-slate-900">
                    Subtotal: ₹{order.subtotal}
                  </span>

                  <div className="flex items-center gap-2">
                    {order.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                          disabled={updatingStatus}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrderToReject(order);
                            setRejectModalOpen(true);
                          }}
                          disabled={updatingStatus}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}

                    {order.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                        disabled={updatingStatus}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <ChefHat className="w-3.5 h-3.5" /> Mark Preparing
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Ready')}
                        disabled={updatingStatus}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <PackageCheck className="w-3.5 h-3.5" /> Mark Ready for Rider
                      </button>
                    )}

                    {['Ready', 'Picked Up', 'Delivered', 'Rejected'].includes(order.status) && (
                      <span className="text-xs text-slate-400 font-medium">
                        {order.status === 'Rejected' ? `Reason: ${order.rejectionReason}` : 'Delivery in progress / completed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REJECT MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Order — Reason Required"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Please enter a clear reason. The customer will see this message directly in their order tracker, and items will be refunded to stock.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Rejection Reason
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Chicken Biryani is unavailable / Kitchen busy at peak hour."
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
              disabled={updatingStatus}
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

export default ShopDashboard;
