import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import {
  ShoppingBag,
  Search,
  Filter,
  User,
  Store,
  Bike,
  Building,
  RotateCcw,
} from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' ? true : o.status === statusFilter;
    const matchesSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.shop?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryAddress?.hostel.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-blue-600" />
            Global Orders Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time hostel orders, preparation statuses, and rider assignments
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, shop, student, hostel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            'All',
            'Pending',
            'Accepted',
            'Preparing',
            'Ready',
            'Picked Up',
            'Delivered',
            'Rejected',
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-xs text-slate-400">
          No orders match the selected filters.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Shop</th>
                  <th className="p-4">Hostel Drop</th>
                  <th className="p-4">Delivery Rider</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/60">
                    <td className="p-4 pl-6 font-black text-slate-900">
                      #{o._id.slice(-6).toUpperCase()}
                      <p className="text-[10px] text-slate-400 font-normal">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{o.customer?.name}</p>
                      <p className="text-[11px] text-slate-400">{o.customer?.phone}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{o.shop?.name}</p>
                      <p className="text-[11px] text-slate-400">{o.shop?.category}</p>
                    </td>

                    <td className="p-4 text-slate-700 font-medium">
                      {o.deliveryAddress?.hostel} (Room {o.deliveryAddress?.roomNumber})
                    </td>

                    <td className="p-4">
                      {o.deliveryPartner ? (
                        <p className="font-bold text-teal-700">
                          🚴 {o.deliveryPartner.name}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="text-sm font-black text-slate-900">
                        ₹{o.total}
                      </span>
                      <p className="text-[10px] text-emerald-600 font-bold">Paid</p>
                    </td>

                    <td className="p-4 pr-6">
                      <OrderStatusBadge status={o.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
