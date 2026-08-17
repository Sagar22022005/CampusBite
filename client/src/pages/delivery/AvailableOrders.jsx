import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Bike,
  Store,
  Building,
  Lock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Shield,
  ArrowRight,
} from 'lucide-react';

const AvailableOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailable();
    const interval = setInterval(fetchAvailable, 5000); // Polling for newly prepared orders
    return () => clearInterval(interval);
  }, []);

  const fetchAvailable = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery/available');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    setError('');
    setAcceptingId(orderId);

    try {
      await api.patch(`/delivery/${orderId}/accept`);
      alert('Order accepted! Customer details are now unlocked in your active deliveries.');
      navigate('/delivery/active');
    } catch (err) {
      setError(err.message);
      fetchAvailable();
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Bike className="w-7 h-7 text-teal-600" />
            Available Campus Deliveries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Accept orders to deliver to student hostels (First-come, first-served)
          </p>
        </div>

        <button
          onClick={fetchAvailable}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center gap-3 text-xs">
        <Shield className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <div>
          <span className="font-bold">Student Privacy Protection Active:</span> Customer contact name, phone, and exact room number remain encrypted and hidden until you accept the delivery.
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <Bike className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No orders awaiting delivery right now
          </h3>
          <p className="text-xs text-slate-500">
            New orders accepted or prepared by campus canteens will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm font-black text-slate-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                    Earn ₹50 Fee
                  </span>
                </div>

                {/* Pickup & Drop Points */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-orange-50/60 border border-orange-100">
                    <Store className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">
                        Pickup from: {order.shop?.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {order.shop?.location || 'IIT Indore'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Building className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">
                        Delivery to: {order.deliveryAddress?.hostel} Hostel
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3 text-slate-400" />
                        Room number & phone unlocked upon acceptance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Items to Pickup ({order.items?.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {order.items?.map((it, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]"
                      >
                        {it.quantity}× {it.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accept Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleAccept(order._id)}
                  disabled={acceptingId !== null}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {acceptingId === order._id ? (
                    'Claiming Delivery...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Accept Delivery (Earn ₹50)
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;
