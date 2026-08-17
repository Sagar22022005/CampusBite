import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  ShieldCheck,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Campus Administrator Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Platform Overview & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Oversee user registrations, shop approvals, campus deliveries, and financial settlements.
          </p>
        </div>
      </div>

      {/* Approvals Alert if pending users exist */}
      {stats?.pendingApprovals > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {stats.pendingApprovals} User(s) Awaiting Admin Approval
              </h3>
              <p className="text-xs text-amber-700">
                New shop owners or delivery riders have signed up and require authorization before login.
              </p>
            </div>
          </div>
          <Link
            to="/admin/approvals"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm whitespace-nowrap"
          >
            Review Approvals ➔
          </Link>
        </div>
      )}

      {/* Financial & Operational Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total GMV (Revenue)
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{stats?.totalRevenue || 0}
          </h3>
          <p className="text-[11px] text-purple-600 font-semibold">
            Across {stats?.totalOrders} total campus orders
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Campus Shops
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-orange-600">
            {stats?.totalShops || 0}
          </h3>
          <p className="text-[11px] text-slate-500">
            {stats?.totalProducts} listed menu products
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Registered Users
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-600">
            {stats?.totalUsers || 0}
          </h3>
          <p className="text-[11px] text-slate-500">
            Students, shop owners & riders
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pending Complaints
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-rose-600">
            {stats?.pendingComplaints || 0}
          </h3>
          <p className="text-[11px] text-slate-500">Awaiting resolution</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/approvals"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
            User Approvals & Role Access
          </h3>
          <p className="text-xs text-slate-500">
            Approve or reject shop owner and delivery partner registration applications.
          </p>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-600">
            <span>Manage Users</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/settlements"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            End-of-Day Settlements
          </h3>
          <p className="text-xs text-slate-500">
            Calculate and execute daily payout disbursements for campus canteens and delivery riders.
          </p>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
            <span>Go to Settlements</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Global Order Oversight
          </h3>
          <p className="text-xs text-slate-500">
            Monitor real-time hostel order flows, active kitchen statuses, and cancellation reasons.
          </p>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
            <span>Inspect Orders</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
