import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Send,
  Building,
  RotateCcw,
  ShieldAlert,
  Plus,
  AlertCircle,
} from 'lucide-react';

const ShopComplaints = () => {
  const [complaintsData, setComplaintsData] = useState({
    incoming: [],
    outgoing: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'

  // Resolve Customer Complaint Modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [resolving, setResolving] = useState(false);

  // Raise Ticket to Admin Modal
  const [adminTicketModalOpen, setAdminTicketModalOpen] = useState(false);
  const [adminSubject, setAdminSubject] = useState('Payout / Settlement Query');
  const [adminMessage, setAdminMessage] = useState('');
  const [submittingAdminTicket, setSubmittingAdminTicket] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/shop');
      if (res.data.incoming && res.data.outgoing) {
        setComplaintsData(res.data);
      } else if (Array.isArray(res.data)) {
        setComplaintsData({ incoming: res.data, outgoing: [] });
      }
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

  const handleAdminTicketSubmit = async (e) => {
    e.preventDefault();
    if (!adminMessage.trim()) {
      alert('Please describe your issue or inquiry for the Admin.');
      return;
    }

    try {
      setSubmittingAdminTicket(true);
      await api.post('/complaints', {
        target: 'admin',
        subject: adminSubject,
        message: adminMessage,
      });

      setAdminSuccessMsg('✅ Support ticket sent directly to CampusBite Admin!');
      setAdminMessage('');
      fetchComplaints();
      setTimeout(() => {
        setAdminTicketModalOpen(false);
        setAdminSuccessMsg('');
        setActiveTab('outgoing');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to submit ticket');
    } finally {
      setSubmittingAdminTicket(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-orange-500" />
            Complaints & Support Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resolve student order complaints or raise support tickets directly to the Campus Admin
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Raise Ticket to Admin
          </button>

          <button
            onClick={fetchComplaints}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'incoming'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📥 Customer Complaints ({complaintsData.incoming.length})
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'outgoing'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📤 My Tickets to Admin ({complaintsData.outgoing.length})
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === 'incoming' ? (
        /* INCOMING CUSTOMER COMPLAINTS */
        complaintsData.incoming.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No student complaints</h3>
            <p className="text-xs text-slate-500">
              Great job! You have zero unresolved student complaints for your shop.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaintsData.incoming.map((comp) => (
              <div
                key={comp._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {comp.subject}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Submitted on {new Date(comp.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                      comp.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                {/* Customer details */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {comp.customer?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {comp.customer?.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-orange-500" />
                    {comp.customer?.hostel} Hostel (Room {comp.customer?.roomNumber})
                  </span>
                </div>

                {/* Complaint Message */}
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 text-xs sm:text-sm text-slate-700 italic">
                  "{comp.message}"
                </div>

                {/* Resolution info or button */}
                {comp.status === 'Resolved' ? (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Your Resolution:
                    </p>
                    <p className="pl-5">{comp.response}</p>
                    {comp.resolvedAt && (
                      <p className="pl-5 text-[10px] text-emerald-700">
                        Resolved on {new Date(comp.resolvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setSelectedComplaint(comp);
                        setResponseText('');
                        setResolveModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Resolve & Respond
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* OUTGOING TICKETS TO ADMIN */
        complaintsData.outgoing.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <ShieldAlert className="w-12 h-12 text-purple-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active tickets to Admin</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Need help with daily bank payouts, student disputes, or platform settings? Click "Raise Ticket to Admin" above.
            </p>
            <button
              onClick={() => setAdminTicketModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Raise Ticket Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {complaintsData.outgoing.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                        Admin Ticket
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {ticket.subject}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-700 italic border border-slate-100">
                  "{ticket.message}"
                </div>

                {ticket.status === 'Resolved' ? (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Admin Response:
                    </p>
                    <p className="pl-5 text-slate-800">{ticket.response}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 p-3 rounded-2xl border border-purple-100">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Pending review by CampusBite Administrator.
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* RESOLVE CUSTOMER COMPLAINT MODAL */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Customer Complaint"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-2">
              Write a message to resolve the student's issue. They will be notified of this resolution.
            </p>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Resolution Note
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. We have replaced the item or updated our preparation steps. Apologies for the inconvenience!"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
            >
              {resolving ? 'Resolving...' : 'Confirm Resolution'}
            </button>
          </div>
        </form>
      </Modal>

      {/* RAISE TICKET TO ADMIN MODAL */}
      <Modal
        isOpen={adminTicketModalOpen}
        onClose={() => setAdminTicketModalOpen(false)}
        title="Raise Support Ticket to Campus Admin"
      >
        {adminSuccessMsg ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">{adminSuccessMsg}</h3>
          </div>
        ) : (
          <form onSubmit={handleAdminTicketSubmit} className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <span>This ticket will be sent directly to the IIT Indore CampusBite Administrator.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={adminSubject}
                onChange={(e) => setAdminSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value="Payout / Settlement Query">Daily Payout / Settlement Query</option>
                <option value="Delivery Rider Escalation">Delivery Rider Escalation</option>
                <option value="Menu / Shop Category Change">Menu / Shop Category Change</option>
                <option value="Platform Bug / Technical Issue">Platform Bug / Technical Issue</option>
                <option value="Other Administrative Support">Other Administrative Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Explain the issue or assistance needed from Admin..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdminTicketModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAdminTicket}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20"
              >
                {submittingAdminTicket ? 'Sending...' : 'Submit to Admin'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ShopComplaints;
