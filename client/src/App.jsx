import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Customer Pages
import CustomerHome from './pages/customer/CustomerHome';
import CategoryShops from './pages/customer/CategoryShops';
import ShopDetail from './pages/customer/ShopDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import TrackOrder from './pages/customer/TrackOrder';
import HelpComplaint from './pages/customer/HelpComplaint';
import Profile from './pages/customer/Profile';

// Shop Owner Pages
import ShopDashboard from './pages/shop/ShopDashboard';
import MyShop from './pages/shop/MyShop';
import ManageProducts from './pages/shop/ManageProducts';
import ShopOrders from './pages/shop/ShopOrders';
import ShopComplaints from './pages/shop/ShopComplaints';
import ShopSales from './pages/shop/ShopSales';

// Delivery Partner Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import AvailableOrders from './pages/delivery/AvailableOrders';
import ActiveDelivery from './pages/delivery/ActiveDelivery';
import DeliveryHistory from './pages/delivery/DeliveryHistory';
import DeliveryHelp from './pages/delivery/DeliveryHelp';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserApprovals from './pages/admin/UserApprovals';
import ManageShops from './pages/admin/ManageShops';
import ManageOrders from './pages/admin/ManageOrders';
import ManageComplaints from './pages/admin/ManageComplaints';
import Settlements from './pages/admin/Settlements';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
            {/* Main Navigation */}
            <Navbar />

            {/* Main View Area */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              <Routes>
                {/* Public & Customer Browse Routes */}
                <Route path="/" element={<CustomerHome />} />
                <Route path="/category/:categoryName" element={<CategoryShops />} />
                <Route path="/shop/:shopId" element={<ShopDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Customer Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/orders/track/:orderId" element={<TrackOrder />} />
                  <Route path="/help" element={<HelpComplaint />} />
                </Route>

                {/* Shared Profile Route (All authenticated users) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Shop Owner Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['shop_owner']} />}>
                  <Route path="/shop/dashboard" element={<ShopDashboard />} />
                  <Route path="/shop/my-shop" element={<MyShop />} />
                  <Route path="/shop/products" element={<ManageProducts />} />
                  <Route path="/shop/orders" element={<ShopOrders />} />
                  <Route path="/shop/complaints" element={<ShopComplaints />} />
                  <Route path="/shop/sales" element={<ShopSales />} />
                </Route>

                {/* Delivery Partner Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['delivery_partner']} />}>
                  <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
                  <Route path="/delivery/available" element={<AvailableOrders />} />
                  <Route path="/delivery/active" element={<ActiveDelivery />} />
                  <Route path="/delivery/history" element={<DeliveryHistory />} />
                  <Route path="/delivery/help" element={<DeliveryHelp />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/approvals" element={<UserApprovals />} />
                  <Route path="/admin/shops" element={<ManageShops />} />
                  <Route path="/admin/orders" element={<ManageOrders />} />
                  <Route path="/admin/complaints" element={<ManageComplaints />} />
                  <Route path="/admin/settlements" element={<Settlements />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
