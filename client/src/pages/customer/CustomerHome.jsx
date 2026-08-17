import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import {
  Utensils,
  ShoppingBag,
  Apple,
  Search,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Food',
    icon: Utensils,
    emoji: '🍔',
    title: 'Canteen & Food',
    description: 'Hot Biryani, Burgers, Pizzas, Thalis & late-night bites',
    bg: 'from-amber-500/20 to-orange-500/20 border-orange-200',
    btnBg: 'bg-orange-500 hover:bg-orange-600',
    count: 'APJ, VSB, Central Canteens',
  },
  {
    name: 'Groceries',
    icon: ShoppingBag,
    emoji: '🛒',
    title: 'Campus Groceries',
    description: 'Daily milk, bread, instant noodles, biscuits & toiletries',
    bg: 'from-emerald-500/20 to-teal-500/20 border-emerald-200',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700',
    count: 'Campus Mart & Stores',
  },
  {
    name: 'Fruits',
    icon: Apple,
    emoji: '🍎',
    title: 'Fresh Fruits',
    description: 'Farm-fresh apples, bananas, mangoes & natural fruit juices',
    bg: 'from-rose-500/20 to-pink-500/20 border-rose-200',
    btnBg: 'bg-rose-600 hover:bg-rose-700',
    count: 'Sports Complex Fruit Corner',
  },
];

const CustomerHome = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shops');
      setShops(res.data);
    } catch (err) {
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      setIsSearching(true);
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(q)}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            IIT Indore Hostel Delivery
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Hungry in Hostel? <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Order from Campus Shops.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Delivering hot meals from APJ, VSB & Central Canteens, daily groceries, and fresh fruits directly to your hostel room.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search biryani, pizza, milk, fruits, maggi..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/30"
            />

            {/* Live Search Results Dropdown */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 max-h-80 overflow-y-auto">
                <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 text-center">
                    No items found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((item) => (
                      <Link
                        key={item._id}
                        to={`/shop/${item.shop?._id}`}
                        className="flex items-center gap-3 p-3 hover:bg-orange-50/50 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.shop?.name} • ₹{item.price}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-orange-600">
                          View ➔
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-6">
        <Link
          to="/orders"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            📦
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
              My Orders & Tracking
            </h4>
            <p className="text-[11px] text-slate-500">Live order tracker & hostel delivery</p>
          </div>
        </Link>

        <Link
          to="/orders"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            ⭐
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Ratings & Reviews
            </h4>
            <p className="text-[11px] text-slate-500">Rate delivered canteen dishes</p>
          </div>
        </Link>

        <Link
          to="/help"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            🆘
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              Help & Raise Complaint
            </h4>
            <p className="text-[11px] text-slate-500">Contact Shop Owner or Admin</p>
          </div>
        </Link>
      </div>

      {/* Categories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Choose a Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse campus shops by what you need right now
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.name}`}
              className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${cat.bg} border transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl">{cat.emoji}</div>
                <span className="text-[11px] font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm">
                  {cat.count}
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Browse Shops</span>
                <div
                  className={`w-7 h-7 rounded-full ${cat.btnBg} text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Campus Shops */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Campus Shops Inside IIT Indore
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Order directly from approved campus canteens and stores
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                to={`/shop/${shop._id}`}
                className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Shop Image Banner */}
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

                  {/* Open / Closed Status Badge */}
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

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm">
                      {shop.category}
                    </span>
                  </div>

                  {/* Rating inside banner */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                    <StarRating rating={shop.rating} numRatings={shop.numRatings} />
                  </div>
                </div>

                {/* Shop Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {shop.description || 'Authentic snacks, meals and items.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {shop.location || 'IIT Indore Campus'}
                    </span>
                    <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                      View Menu ➔
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How it Works / Campus Promise */}
      <section className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/60">
        <div className="text-center max-w-lg mx-auto mb-8">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            How CampusBite Works
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Built specially for students and staff residing inside IIT Indore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/50 space-y-2">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl mx-auto flex items-center justify-center font-black">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-800">Select Shop</h4>
            <p className="text-[11px] text-slate-500">
              Pick your favourite campus canteen or mart
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/50 space-y-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl mx-auto flex items-center justify-center font-black">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-800">Add to Cart</h4>
            <p className="text-[11px] text-slate-500">
              Choose food, groceries, or fruits with live stock
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/50 space-y-2">
            <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl mx-auto flex items-center justify-center font-black">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-800">Hostel Room Drop</h4>
            <p className="text-[11px] text-slate-500">
              Select hostel (APJ, CVR, VSB, etc.) & room
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-200/50 space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl mx-auto flex items-center justify-center font-black">
              4
            </div>
            <h4 className="text-xs font-bold text-slate-800">Track & Enjoy</h4>
            <p className="text-[11px] text-slate-500">
              Watch real-time status & enjoy your warm meal
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerHome;
