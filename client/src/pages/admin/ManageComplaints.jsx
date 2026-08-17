import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Building,
  Store,
  Send,
  RotateCcw,
} from 'lucide-react';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Resolve modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/admin');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setResolving(true);
    try {
      await api.patch(`/complaints/${selectedComplaint._id}/resolve`, {
        response: responseText,
      });
      setResolveModalOpen(false);
      setResponseText('');
      fetchComplaints();
    } catch (err) {
      alert(err.message);
    } finally {
      setResolving(false);
    }
  };

  const filtered = complaints.filter((c) =>
    statusFilter === 'All' ? true : c.status === statusFilter
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-rose-500" />
            Complaints & Inquiry Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resolve student platform issues and review shop owner resolutions
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {['All', 'Pending', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st} ({st === 'All' ? complaints.length : complaints.filter((c) => c.status === st).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-xs text-slate-400">
          No complaints matching this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900">
                    {c.subject}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.target === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}
                  >
                    Target: {c.target === 'admin' ? 'Admin' : `Shop (${c.shop?.name || 'Shop'})`}
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                    c.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* Customer details */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {c.customer?.name} ({c.customer?.email})
                </span>
                <span>Phone: {c.customer?.phone}</span>
                <span>
                  Hostel: {c.customer?.hostel} ({c.customer?.roomNumber})
                </span>
                <span className="text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Message */}
              <div className="p-4 bg-slate-50/80 rounded-2xl text-xs sm:text-sm text-slate-700 italic border border-slate-100">
                "{c.message}"
              </div>

              {/* Resolution or Action */}
              {c.status === 'Resolved' ? (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolution:
                  </p>
                  <p className="pl-5">{c.response}</p>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedComplaint(c);
                      setResponseText('');
                      setResolveModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Resolve Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RESOLVE MODAL */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Admin Ticket Resolution"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Enter the administrative resolution or update message for the student.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Resolution Note
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Issue verified and resolved. Canteen guidelines have been updated."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resolving}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              {resolving ? 'Resolving...' : 'Confirm Resolution'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageComplaints;
