import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Store,
  Bike,
  ShieldAlert,
  HelpCircle,
  Clock,
  Compass,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-orange-50 text-orange-600 shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Campus<span className="text-orange-500">Bite</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md">
                  IIT Indore
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Hostel Food, Grocery & Fruits
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Customer Links */}
            {(!isAuthenticated || user?.role === 'customer') && (
              <>
                <NavLink to="/" className={navLinkStyle}>
                  Home
                </NavLink>
                <NavLink to="/category/Food" className={navLinkStyle}>
                  🍔 Food
                </NavLink>
                <NavLink to="/category/Groceries" className={navLinkStyle}>
                  🛒 Groceries
                </NavLink>
                <NavLink to="/category/Fruits" className={navLinkStyle}>
                  🍎 Fruits
                </NavLink>
                <NavLink to="/orders" className={navLinkStyle}>
                  Orders
                </NavLink>
                <NavLink to="/help" className={navLinkStyle}>
                  Help
                </NavLink>
              </>
            )}

            {/* Shop Owner Links */}
            {user?.role === 'shop_owner' && (
              <>
                <NavLink to="/shop/dashboard" className={navLinkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/shop/my-shop" className={navLinkStyle}>
                  My Shop
                </NavLink>
                <NavLink to="/shop/products" className={navLinkStyle}>
                  Products
                </NavLink>
                <NavLink to="/shop/orders" className={navLinkStyle}>
                  Orders
                </NavLink>
                <NavLink to="/shop/complaints" className={navLinkStyle}>
                  Complaints
                </NavLink>
                <NavLink to="/shop/sales" className={navLinkStyle}>
                  Sales
                </NavLink>
              </>
            )}

            {/* Delivery Partner Links */}
            {user?.role === 'delivery_partner' && (
              <>
                <NavLink to="/delivery/dashboard" className={navLinkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/delivery/available" className={navLinkStyle}>
                  Available Orders
                </NavLink>
                <NavLink to="/delivery/active" className={navLinkStyle}>
                  Active Delivery
                </NavLink>
                <NavLink to="/delivery/history" className={navLinkStyle}>
                  History
                </NavLink>
                <NavLink to="/delivery/help" className={navLinkStyle}>
                  🆘 Help
                </NavLink>
              </>
            )}

            {/* Admin Links */}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/approvals" className={navLinkStyle}>
                  Approvals
                </NavLink>
                <NavLink to="/admin/shops" className={navLinkStyle}>
                  Shops
                </NavLink>
                <NavLink to="/admin/orders" className={navLinkStyle}>
                  Orders
                </NavLink>
                <NavLink to="/admin/complaints" className={navLinkStyle}>
                  Complaints
                </NavLink>
                <NavLink to="/admin/settlements" className={navLinkStyle}>
                  Settlements
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button (Customer only) */}
            {(!isAuthenticated || user?.role === 'customer') && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-all group"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons or User Badge */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-medium text-orange-600 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 transition-opacity"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {(!isAuthenticated || user?.role === 'customer') && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg bg-slate-100 text-slate-700"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {(!isAuthenticated || user?.role === 'customer') && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Home
              </Link>
              <Link
                to="/category/Food"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                🍔 Food
              </Link>
              <Link
                to="/category/Groceries"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                🛒 Groceries
              </Link>
              <Link
                to="/category/Fruits"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                🍎 Fruits
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                My Orders
              </Link>
              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              >
                Help & Complaints
              </Link>
            </>
          )}

          {user?.role === 'shop_owner' && (
            <>
              <Link
                to="/shop/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Dashboard
              </Link>
              <Link
                to="/shop/my-shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                My Shop
              </Link>
              <Link
                to="/shop/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Products
              </Link>
              <Link
                to="/shop/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Orders
              </Link>
              <Link
                to="/shop/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Complaints
              </Link>
              <Link
                to="/shop/sales"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Sales
              </Link>
            </>
          )}

          {user?.role === 'delivery_partner' && (
            <>
              <Link
                to="/delivery/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Dashboard
              </Link>
              <Link
                to="/delivery/available"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Available Orders
              </Link>
              <Link
                to="/delivery/active"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Active Delivery
              </Link>
              <Link
                to="/delivery/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                History
              </Link>
              <Link
                to="/delivery/help"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 font-bold"
              >
                🆘 Rider Help & Support
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/approvals"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                User Approvals
              </Link>
              <Link
                to="/admin/shops"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Shops
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Orders
              </Link>
              <Link
                to="/admin/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Complaints
              </Link>
              <Link
                to="/admin/settlements"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                Settlements
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-800"
                >
                  My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-2 text-sm font-semibold text-left text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold bg-slate-100 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-bold text-white bg-orange-500 rounded-xl"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
