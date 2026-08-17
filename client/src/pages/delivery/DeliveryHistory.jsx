import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  PackageCheck,
  DollarSign,
  Calendar,
  Store,
  Building,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

const DeliveryHistory = () => {
  const [historyData, setHistoryData] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    orders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery/history');
      setHistoryData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-7 h-7 text-teal-600" />
            Completed Delivery Trips
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log of all completed deliveries and credited delivery fees
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Successful Deliveries
            </p>
            <h3 className="text-3xl font-black text-slate-900">
              {historyData.totalDeliveries}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">
              Delivered safely to hostel rooms
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <PackageCheck className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Delivery Earnings
            </p>
            <h3 className="text-3xl font-black text-teal-600">
              ₹{historyData.totalEarnings}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Fixed ₹50 fee per completed trip
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Table of completed orders */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
          Delivered Orders History ({historyData.orders.length})
        </h2>

        {historyData.orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No completed delivery trips yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Shop</th>
                  <th className="pb-3">Hostel Destination</th>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Fee Earned</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(o.updatedAt || o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {o.shop?.name}
                    </td>
                    <td className="py-3 text-slate-600">
                      {o.deliveryAddress?.hostel} (Room {o.deliveryAddress?.roomNumber})
                    </td>
                    <td className="py-3 text-slate-600">
                      {o.customer?.name}
                    </td>
                    <td className="py-3 font-black text-teal-600">
                      +₹{o.deliveryFee || 50}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Delivered
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

export default DeliveryHistory;
