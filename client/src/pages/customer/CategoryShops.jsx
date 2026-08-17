import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import { MapPin, Search, ArrowLeft } from 'lucide-react';

const CATEGORY_META = {
  Food: { emoji: '🍔', title: 'Campus Canteens & Food', desc: 'Biryani, rolls, pizzas, thalis, and quick snacks' },
  Groceries: { emoji: '🛒', title: 'Hostel Groceries & Essentials', desc: 'Milk, snacks, packaged items, and daily staples' },
  Fruits: { emoji: '🍎', title: 'Fresh Fruits & Juices', desc: 'Seasonal healthy fruits, juices, and platters' },
};

const CategoryShops = () => {
  const { categoryName } = useParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const meta = CATEGORY_META[categoryName] || {
    emoji: '🏪',
    title: `${categoryName} Shops`,
    desc: 'Browse verified campus stores inside IIT Indore',
  };

  useEffect(() => {
    fetchShops();
  }, [categoryName]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shops?category=${categoryName}`);
      setShops(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {meta.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">{meta.desc}</p>
            </div>
          </div>
        </div>

        {/* Category Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${categoryName} shops...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Category switcher pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Food', 'Groceries', 'Fruits'].map((cat) => (
          <Link
            key={cat}
            to={`/category/${cat}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              categoryName === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {CATEGORY_META[cat]?.emoji} {cat}
          </Link>
        ))}
      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-4xl mb-3">🏪</p>
          <h3 className="text-lg font-bold text-slate-800">No shops found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No shops available in {categoryName} matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/${shop._id}`}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Open/Closed Badge */}
                <div className="absolute top-3 left-3">
                  {shop.isOpen ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      🟢 Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-md">
                      🔴 Closed
                    </span>
                  )}
                </div>

                {/* Rating in banner */}
                <div className="absolute bottom-3 left-3">
                  <StarRating rating={shop.rating} numRatings={shop.numRatings} />
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {shop.description || 'Quality meals and items inside campus.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {shop.location || 'IIT Indore'}
                  </span>
                  <span className="font-bold text-orange-600">
                    Order Now ➔
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryShops;
