import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  RotateCcw,
  Bike,
  Building,
} from 'lucide-react';

const DeliveryHelp = () => {
  const [subject, setSubject] = useState('Hostel Gate Entry / Security Access Issue');
  const [message, setMessage] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setFetching(true);
      const res = await api.get('/complaints/my');
      setMyTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide details of your issue.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/complaints', {
        target: 'admin',
        subject,
        message,
      });

      setSuccess('✅ Your support ticket was sent directly to the CampusBite Admin!');
      setMessage('');
      fetchTickets();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Bike className="w-7 h-7 text-teal-600" />
            Rider Help & Admin Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Raise issues with hostel access, unreachable students, canteen delays, or delivery fee payouts
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh Tickets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">
                Raise New Ticket to Admin
              </h2>
            </div>

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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Issue Category / Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
                >
                  <option value="Hostel Gate Entry / Security Access Issue">
                    Hostel Gate Entry / Security Access Issue
                  </option>
                  <option value="Student Unreachable / Wrong Room Number">
                    Student Unreachable / Wrong Room Number
                  </option>
                  <option value="Canteen Delay / Food Not Ready on Pickup">
                    Canteen Delay / Food Not Ready on Pickup
                  </option>
                  <option value="Delivery Fee / Day-End Payout Query">
                    Delivery Fee (₹50) / Payout Query
                  </option>
                  <option value="Accident / Bike Breakdown During Delivery">
                    Emergency / Vehicle Breakdown
                  </option>
                  <option value="App Bug / Order State Error">
                    App Bug / Order State Error
                  </option>
                  <option value="Other Rider Support">Other Rider Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the order ID, hostel location, or exact issue encountered..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Submitting to Admin...' : 'Submit Ticket to Admin'}
              </button>
            </form>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Your Support Tickets ({myTickets.length})
          </h2>

          {fetching ? (
            <div className="py-8 text-center">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : myTickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center text-xs text-slate-400">
              No tickets raised. All rides running smoothly!
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">
                      {t.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="text-slate-600 italic line-clamp-2">"{t.message}"</p>

                  <div className="text-[10px] text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>

                  {t.response && (
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 mt-2 text-[11px] text-emerald-900">
                      <p className="font-bold text-emerald-800 mb-0.5">Admin Resolution:</p>
                      <p>{t.response}</p>
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

export default DeliveryHelp;
