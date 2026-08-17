import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  PackageCheck,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const ShopSales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/shop/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const totalSales = deliveredOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const settledOrders = deliveredOrders.filter((o) => o.isSettledShop);
  const settledAmount = settledOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const pendingPayout = totalSales - settledAmount;
  const avgOrderValue =
    deliveredOrders.length > 0
      ? (totalSales / deliveredOrders.length).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-orange-500" />
          Sales & Financial Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Overview of food sales, delivered orders, and platform settlement payouts
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Net Sales
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{totalSales}
          </h3>
          <p className="text-[11px] text-slate-500">
            From {deliveredOrders.length} completed deliveries
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Settled by Admin
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">
            ₹{settledAmount}
          </h3>
          <p className="text-[11px] text-emerald-700">
            {settledOrders.length} orders disbursed
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pending Settlement
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-600">
            ₹{pendingPayout}
          </h3>
          <p className="text-[11px] text-amber-700">
            Awaiting end-of-day payout
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Avg Order Value
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-purple-600">
            ₹{avgOrderValue}
          </h3>
          <p className="text-[11px] text-purple-700">Per delivered meal</p>
        </div>
      </div>

      {/* Completed Orders Revenue Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
          Completed Order Revenue Breakdown ({deliveredOrders.length})
        </h2>

        {deliveredOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No completed sales orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Hostel</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Subtotal</th>
                  <th className="pb-3">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-medium text-slate-700">
                      {o.deliveryAddress?.hostel} ({o.deliveryAddress?.roomNumber})
                    </td>
                    <td className="py-3 text-slate-600">
                      {o.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                    </td>
                    <td className="py-3 font-black text-slate-900">
                      ₹{o.subtotal}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.isSettledShop
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {o.isSettledShop ? 'Settled' : 'Pending Payout'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSales;
