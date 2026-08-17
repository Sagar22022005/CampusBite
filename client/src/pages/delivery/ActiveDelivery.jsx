import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import {
  Bike,
  Store,
  Building,
  User,
  Phone,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  Navigation,
} from 'lucide-react';

const ActiveDelivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  const fetchActiveDeliveries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery/active');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.patch(`/delivery/${orderId}/status`, { status: newStatus });
      fetchActiveDeliveries();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Navigation className="w-7 h-7 text-teal-600" />
            Active Delivery Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Deliveries assigned to you with customer contact & room details
          </p>
        </div>

        <button
          onClick={fetchActiveDeliveries}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No active deliveries right now
          </h3>
          <p className="text-xs text-slate-500">
            Go to "Available Orders" to accept a new delivery task.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span className="text-xs font-extrabold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200 w-fit">
                  Earn ₹50 on Delivery
                </span>
              </div>

              {/* Pickup & Destination Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Pickup */}
                <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-orange-900 font-bold">
                    <Store className="w-4 h-4 text-orange-600" />
                    Pickup From:
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {order.shop?.name}
                    </h4>
                    <p className="text-slate-600 mt-0.5">
                      {order.shop?.location || 'IIT Indore Campus'}
                    </p>
                  </div>
                </div>

                {/* Drop Location */}
                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-teal-900 font-bold">
                    <Building className="w-4 h-4 text-teal-600" />
                    Deliver To Student:
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center justify-between">
                      <span>{order.deliveryAddress?.name}</span>
                      <a
                        href={`tel:${order.deliveryAddress?.phone}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Student
                      </a>
                    </h4>
                    <p className="text-slate-800 font-bold mt-1">
                      {order.deliveryAddress?.hostel} Hostel — Room {order.deliveryAddress?.roomNumber}
                    </p>
                    <p className="text-slate-500">Phone: {order.deliveryAddress?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items to Deliver ({order.items?.length})
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {order.items?.map((it, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-800 border border-slate-200"
                    >
                      {it.quantity}× {it.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Order Total: <strong>₹{order.total}</strong> (Paid via Dummy Pay)
                </div>

                <div className="flex items-center gap-3">
                  {['Accepted', 'Preparing', 'Ready'].includes(order.status) && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Picked Up')}
                      disabled={updatingId !== null}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
                    >
                      <PackageCheck className="w-4 h-4" />
                      Mark Order as Picked Up
                    </button>
                  )}

                  {order.status === 'Picked Up' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                      disabled={updatingId !== null}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Order Delivered to Room
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveDelivery;
