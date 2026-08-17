import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Bike,
  DollarSign,
  PackageCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

const DeliveryDashboard = () => {
  const [availableCount, setAvailableCount] = useState(0);
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyData, setHistoryData] = useState({ totalDeliveries: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    try {
      setLoading(true);
      const [availRes, activeRes, histRes] = await Promise.all([
        api.get('/delivery/available'),
        api.get('/delivery/active'),
        api.get('/delivery/history'),
      ]);
      setAvailableCount(availRes.data.length);
      setActiveOrders(activeRes.data);
      setHistoryData(histRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Bike className="w-3.5 h-3.5" />
            IIT Indore Campus Delivery Fleet
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Delivery Partner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Pick up fresh meals & groceries from campus shops and deliver directly to student hostel rooms.
          </p>
        </div>

        <Link
          to="/delivery/help"
          className="self-start sm:self-auto relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
        >
          <span>🆘 Raise Ticket to Admin</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Earnings
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{historyData.totalEarnings}
          </h3>
          <p className="text-[11px] text-teal-600 font-semibold">
            ₹50 per delivered order
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Orders
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-orange-600">
            {availableCount}
          </h3>
          <p className="text-[11px] text-slate-400">Ready for pickup now</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Bike className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Deliveries
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-600">
            {activeOrders.length}
          </h3>
          <p className="text-[11px] text-slate-400">In your delivery queue</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <PackageCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Trips
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">
            {historyData.totalDeliveries}
          </h3>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Delivered successfully
          </p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/delivery/available"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-200">
              {availableCount} Available
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            Claim Available Deliveries
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Browse orders ready for pickup across campus. First partner to click Accept claims the order.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-orange-600">
            <span>View Available Pool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/delivery/active"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Bike className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200">
              {activeOrders.length} Active
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
            Manage Active Deliveries
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            View unlocked customer contacts, hostel room numbers, and mark orders as Picked Up or Delivered.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-teal-600">
            <span>Go to Active Orders</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
