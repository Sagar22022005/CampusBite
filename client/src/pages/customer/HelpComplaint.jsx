import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  HelpCircle,
  MessageSquare,
  Store,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';

const HelpComplaint = () => {
  const [target, setTarget] = useState('shop_owner'); // 'shop_owner' or 'admin'
  const [shopId, setShopId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [shops, setShops] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShops();
    fetchComplaints();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get('/shops');
      setShops(res.data);
      if (res.data.length > 0) setShopId(res.data[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/my');
      setMyComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/complaints', {
        target,
        shopId: target === 'shop_owner' ? shopId : null,
        subject,
        message,
      });

      setSuccess('Your complaint / request has been submitted successfully!');
      setSubject('');
      setMessage('');
      fetchComplaints();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-orange-500" />
          Help & Complaint Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Submit queries or complaints to a specific Shop Owner or the Campus Delivery Admin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              File a New Ticket
            </h2>

            {success && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {success}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Complaint To:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTarget('shop_owner')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      target === 'shop_owner'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Store className="w-4 h-4 text-orange-500" />
                    <div className="text-left">
                      <p className="text-xs">Shop Owner</p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        Order issues, food quality
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTarget('admin')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      target === 'admin'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <div className="text-left">
                      <p className="text-xs">Platform Admin</p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        App, delivery, general
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Shop selector if shop owner targeted */}
              {target === 'shop_owner' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Campus Shop
                  </label>
                  <select
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                  >
                    {shops.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missing item in APJ order / Late delivery"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Complaint Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </div>

        {/* Complaints History Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Your Previous Tickets ({myComplaints.length})
          </h2>

          {myComplaints.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center text-xs text-slate-500">
              No complaints filed. You're all clear!
            </div>
          ) : (
            <div className="space-y-3">
              {myComplaints.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate max-w-[140px]">
                      {c.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-slate-600 italic line-clamp-2">"{c.message}"</p>

                  <div className="text-[10px] text-slate-400">
                    To: {c.target === 'shop_owner' ? c.shop?.name || 'Shop' : 'Admin'} •{' '}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>

                  {c.response && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mt-2 text-[11px] text-slate-700">
                      <p className="font-bold text-emerald-700 mb-0.5">Response:</p>
                      <p>{c.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpComplaint;
