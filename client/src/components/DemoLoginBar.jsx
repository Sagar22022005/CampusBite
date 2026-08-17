import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Store, Bike, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

const DemoLoginBar = () => {
  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDemoSwitch = async (role) => {
    try {
      setLoadingRole(role);
      const data = await demoLogin(role);
      if (data?.user?.role === 'shop_owner') navigate('/shop/dashboard');
      else if (data?.user?.role === 'delivery_partner') navigate('/delivery/dashboard');
      else if (data?.user?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      alert(`Demo login error: ${err.message}`);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-500/30">
            <Sparkles className="w-3 h-3" /> Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-400">
            1-Click role testing for IIT Indore:
          </span>
          {user && (
            <span className="text-slate-300 font-medium">
              Current: <strong className="text-white capitalize">{user.role.replace('_', ' ')}</strong> ({user.name})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => handleDemoSwitch('customer')}
            disabled={loadingRole !== null}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              user?.role === 'customer'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3 h-3 text-orange-300" />
            Customer
          </button>

          <button
            onClick={() => handleDemoSwitch('shop_owner')}
            disabled={loadingRole !== null}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              user?.role === 'shop_owner'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Store className="w-3 h-3 text-amber-300" />
            Shop Owner
          </button>

          <button
            onClick={() => handleDemoSwitch('delivery_partner')}
            disabled={loadingRole !== null}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              user?.role === 'delivery_partner'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Bike className="w-3 h-3 text-teal-300" />
            Delivery Partner
          </button>

          <button
            onClick={() => handleDemoSwitch('admin')}
            disabled={loadingRole !== null}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-medium ${
              user?.role === 'admin'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-purple-300" />
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoLoginBar;
