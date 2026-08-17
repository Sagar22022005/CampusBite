import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Store,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    cartShop,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center border border-orange-200">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore campus canteens, groceries, and fruit stalls to add delicious items to your cart.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors mt-2"
        >
          Explore Campus Shops
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={cartShop?.id ? `/shop/${cartShop.id}` : '/'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your Cart
          </h1>
          {cartShop && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Store className="w-3.5 h-3.5 text-orange-500" />
              Ordering from: <strong className="text-slate-800">{cartShop.name}</strong>
            </p>
          )}
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
                }}
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  ₹{item.price} × {item.quantity} ={' '}
                  <strong className="text-slate-900 font-bold">
                    ₹{item.price * item.quantity}
                  </strong>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  In Stock: {item.stock}
                </p>
              </div>

              {/* Quantity Stepper & Remove */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="p-1 rounded-lg text-slate-700 hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1 rounded-lg text-slate-700 hover:bg-white transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 sticky top-24">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Bill Summary
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Delivery Fee
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                    Campus Fixed
                  </span>
                </span>
                <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/60 text-[11px] text-orange-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>Dummy Payment supported at Checkout</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
