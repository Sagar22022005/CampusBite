import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import Modal from '../../components/Modal';
import {
  Building,
  Home,
  User,
  Phone,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

const HOSTELS = [
  'APJ',
  'CVR',
  'VSB',
  'DA',
  'HJB',
  'JC Bose',
  'LRC',
  'Sports Complex',
  'Takshashila Complex',
  'Amul',
  'Kendriya Vidyalaya',
  'Other',
];

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, cartShop, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hostel: user?.hostel || 'APJ',
    roomNumber: user?.roomNumber || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.roomNumber) {
      setError('Please provide full delivery address including hostel and room number');
      return;
    }
    setError('');
    setIsPaymentModalOpen(true);
  };

  const handleExecuteDummyPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Create order via API
      const res = await api.post('/orders', {
        shopId: cartShop.id,
        items: cartItems,
        deliveryAddress,
      });

      const order = res.data.order;
      setCreatedOrder(order);
      setPaymentSuccess(true);
      clearCart();

      // Automatically redirect to Order Tracking after 2 seconds
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        navigate(`/orders/track/${order._id}`);
      }, 2200);
    } catch (err) {
      setError(err.message);
      setIsPaymentModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !paymentSuccess) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Hostel Delivery Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enter your hostel room details to receive your order
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleOpenPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base sm:text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-500" />
                Delivery Location Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Aman Sharma"
                      value={deliveryAddress.name}
                      onChange={handleAddressChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 9876543210"
                      value={deliveryAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hostel Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Hostel / Complex
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="hostel"
                      value={deliveryAddress.hostel}
                      onChange={handleAddressChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                    >
                      {HOSTELS.map((h) => (
                        <option key={h} value={h}>
                          {h} Hostel
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Room Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Hostel Room Number
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="roomNumber"
                      required
                      placeholder="e.g. A-203, Block 2"
                      value={deliveryAddress.roomNumber}
                      onChange={handleAddressChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800">
                Order Items ({cartItems.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        {item.quantity}×
                      </span>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Total & Trigger */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-24">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                Payment Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                  <span>Final Amount</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  Dummy Payment Simulation
                </p>
                <p className="text-[11px] text-slate-500">
                  No real card details needed. Click below to simulate instant payment & place order.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Pay ₹{total}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* DUMMY PAYMENT MODAL */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => !loading && setIsPaymentModalOpen(false)}
        title="Dummy Payment Gateway"
      >
        {paymentSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Dummy Payment Successful! 🎉
            </h3>
            <p className="text-xs text-slate-500">
              Your order has been placed with <strong>{cartShop?.name}</strong>.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold">
              Redirecting to live order tracking...
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-center space-y-1">
              <p className="text-xs font-bold text-orange-800 uppercase tracking-wider">
                Total Payable
              </p>
              <p className="text-3xl font-black text-orange-600">₹{total}</p>
              <p className="text-[11px] text-orange-700">
                To {cartShop?.name} ({deliveryAddress.hostel} Room {deliveryAddress.roomNumber})
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-slate-800">Dummy Campus Pay</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery To:</span>
                <span className="font-bold text-slate-800">
                  {deliveryAddress.hostel} - {deliveryAddress.roomNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Student Phone:</span>
                <span className="font-bold text-slate-800">{deliveryAddress.phone}</span>
              </div>
            </div>

            <button
              onClick={handleExecuteDummyPayment}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Pay ₹{total}
                </>
              )}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Checkout;
