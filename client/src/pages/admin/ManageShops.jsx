import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import { Store, Trash2, MapPin, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shops');
      setShops(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm('Are you sure you want to remove this shop and all its listed products?')) return;
    try {
      setDeletingId(shopId);
      await api.delete(`/admin/shops/${shopId}`);
      fetchShops();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-orange-500" />
            Campus Shops Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            List and moderate all canteens, grocery stores and fruit stalls in IIT Indore
          </p>
        </div>

        <button
          onClick={fetchShops}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-xs text-slate-400">
          No campus shops registered.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                        shop.isOpen ? 'bg-emerald-500' : 'bg-rose-600'
                      }`}
                    >
                      {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm">
                      {shop.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {shop.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {shop.description || 'Campus shop.'}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    {shop.location || 'IIT Indore'}
                  </div>
                  <div className="pt-1">
                    <StarRating rating={shop.rating} numRatings={shop.numRatings} />
                  </div>
                </div>
              </div>

              {/* Owner Info & Actions */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                <div className="text-[11px] text-slate-500">
                  Owner: <strong className="text-slate-700">{shop.owner?.name}</strong>
                </div>
                <button
                  onClick={() => handleDeleteShop(shop._id)}
                  disabled={deletingId === shop._id}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Remove Shop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageShops;
