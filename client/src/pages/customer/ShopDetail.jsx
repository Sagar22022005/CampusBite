import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import {
  Search,
  MapPin,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageSquareQuote,
  HelpCircle,
  Store,
  ShieldAlert,
  Send,
  Star,
} from 'lucide-react';

const ShopDetail = () => {
  const { shopId } = useParams();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'reviews'

  // Help & Complaint Modal State
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [complaintTarget, setComplaintTarget] = useState('shop_owner'); // 'shop_owner' or 'admin'
  const [complaintSubject, setComplaintSubject] = useState('Food Quality / Canteen Inquiry');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState('');

  useEffect(() => {
    fetchShopData();
    fetchRatings();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shops/${shopId}`);
      setShop(res.data.shop);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/ratings/shop/${shopId}`);
      setRatings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getItemQuantityInCart = (productId) => {
    const item = cartItems.find((ci) => ci.productId === productId);
    return item ? item.quantity : 0;
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in with your @iiti.ac.in account to submit a complaint.');
      return;
    }
    if (!complaintMessage.trim()) {
      alert('Please enter a description for your complaint or inquiry.');
      return;
    }

    try {
      setSubmittingComplaint(true);
      const payload = {
        target: complaintTarget,
        shopId: complaintTarget === 'shop_owner' ? shop._id : undefined,
        subject: complaintSubject,
        message: complaintMessage,
      };

      const res = await api.post('/complaints', payload);
      setComplaintSuccess(
        complaintTarget === 'shop_owner'
          ? `✅ Your complaint was sent directly to ${shop.name}'s dashboard!`
          : `✅ Your complaint was submitted directly to the CampusBite Admin!`
      );
      setComplaintMessage('');
      setTimeout(() => {
        setHelpModalOpen(false);
        setComplaintSuccess('');
      }, 2500);
    } catch (err) {
      alert(err.message || 'Failed to submit complaint');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Shop not found</h2>
        <Link to="/" className="text-orange-600 font-bold mt-2 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Back Link & Quick Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shops
        </Link>

        {/* Prominent Help / Report Issue button */}
        <button
          onClick={() => {
            setComplaintTarget('shop_owner');
            setHelpModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-rose-600" />
          Need Help / Report Issue
        </button>
      </div>

      {/* Shop Hero Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="h-52 sm:h-64 w-full bg-slate-900 relative">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          <div className="absolute top-4 left-4">
            {shop.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                🟢 Open for Ordering
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-lg">
                🔴 Closed Currently
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 shadow-sm backdrop-blur-md">
              {shop.category}
            </span>
          </div>

          {/* Title & info over bottom of cover */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
              {shop.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl drop-shadow">
              {shop.description}
            </p>
          </div>
        </div>

        {/* Shop Stats Bar */}
        <div className="px-6 py-4 bg-slate-50 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('reviews')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <StarRating rating={shop.rating} numRatings={shop.numRatings} size="lg" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <MapPin className="w-4 h-4 text-orange-500" />
              {shop.location || 'IIT Indore Campus'}
            </div>
          </div>

          {/* Action Tabs + Help Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'menu'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Menu Items ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⭐ Reviews ({ratings.length})
              </button>
            </div>

            <button
              onClick={() => {
                setComplaintTarget('shop_owner');
                setHelpModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help / Issue
            </button>
          </div>
        </div>
      </div>

      {/* Closed Shop Banner Alert */}
      {!shop.isOpen && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-medium">
            This shop is currently closed by the owner. You can browse items, but ordering is paused until they reopen.
          </p>
        </div>
      )}

      {/* MENU TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Search inside shop */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-900 self-start">
              Shop Menu & Stock
            </h2>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search products in ${shop.name}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-4xl mb-2">🍽️</p>
              <h3 className="text-base font-bold text-slate-800">
                No items match your search
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for another dish or product name.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const qtyInCart = getItemQuantityInCart(product._id);
                const isOutOfStock = product.stock <= 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4 hover:border-orange-200 transition-all"
                  >
                    {/* Left details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        {isOutOfStock ? (
                          <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            Sold Out
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Stock: {product.stock}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {product.description || 'Fresh campus preparation.'}
                      </p>

                      <div className="pt-1">
                        <span className="text-base font-black text-slate-900">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>

                    {/* Right image & cart action */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Add/Quantity Buttons */}
                      {shop.isOpen && !isOutOfStock && (
                        <div>
                          {qtyInCart === 0 ? (
                            <button
                              onClick={() => addToCart(product, shop)}
                              className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-2 py-1 rounded-xl">
                              <button
                                onClick={() =>
                                  updateQuantity(product._id, qtyInCart - 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded-lg bg-white text-orange-700 hover:bg-orange-100 transition-colors font-black text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-orange-700 min-w-[16px] text-center">
                                {qtyInCart}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(product._id, qtyInCart + 1)
                                }
                                disabled={qtyInCart >= product.stock}
                                className="w-5 h-5 flex items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 transition-colors font-black text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Customer Ratings & Feedback
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified reviews from students who ordered from {shop.name}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
              <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
                ⭐ {shop.rating > 0 ? shop.rating.toFixed(1) : 'New'}
              </div>
              <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
                Based on <strong className="text-slate-800">{shop.numRatings}</strong> student ratings
              </div>
            </div>
          </div>

          {ratings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-4xl mb-2">⭐</p>
              <h3 className="text-base font-bold text-slate-800">
                No reviews yet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Be the first to order and review {shop.name} after delivery!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratings.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                        {r.customer?.name ? r.customer.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {r.customer?.name || 'IIT Indore Student'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} showNumber={false} size="sm" />
                  </div>

                  <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl">
                    "{r.review || 'Great food and timely delivery!'}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOATING CART SUMMARY BADGE (IF ITEMS IN CART) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <Link
            to="/cart"
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>View Cart ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
              ₹{cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}
            </span>
          </Link>
        </div>
      )}

      {/* HELP & COMPLAINT MODAL */}
      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title={`Help & Support for ${shop.name}`}
      >
        {complaintSuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">{complaintSuccess}</h3>
            <p className="text-xs text-slate-500">
              You can track the resolution status anytime in your Help page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Select where to direct your complaint or inquiry:
            </p>

            {/* TWO CLEAR OPTIONS: SHOP OWNER vs ADMIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setComplaintTarget('shop_owner')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  complaintTarget === 'shop_owner'
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-black text-slate-900">
                    🏪 Shop Owner
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Directly to <strong>{shop.name}</strong> dashboard (food quality, packaging, missing items).
                </p>
              </label>

              <label
                onClick={() => setComplaintTarget('admin')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  complaintTarget === 'admin'
                    ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-slate-900">
                    👑 Campus Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Directly to <strong>IIT Indore Admin</strong> (billing disputes, platform bugs, urgent escalation).
                </p>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
              >
                <option value="Food Quality / Taste Issue">Food Quality / Taste Issue</option>
                <option value="Missing Items in Delivery">Missing Items in Delivery</option>
                <option value="Packaging / Spill Issue">Packaging / Spill Issue</option>
                <option value="Delay in Preparation">Delay in Preparation</option>
                <option value="Payment / Billing Query">Payment / Billing Query</option>
                <option value="Other General Feedback">Other General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe your issue or feedback in detail..."
                value={complaintMessage}
                onChange={(e) => setComplaintMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingComplaint}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 ${
                  complaintTarget === 'shop_owner'
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                {submittingComplaint
                  ? 'Submitting...'
                  : complaintTarget === 'shop_owner'
                  ? 'Send to Shop Owner'
                  : 'Send to Admin'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ShopDetail;
