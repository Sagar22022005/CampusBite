import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import {
  CreditCard,
  DollarSign,
  Store,
  Bike,
  CheckCircle2,
  Clock,
  Calendar,
  RotateCcw,
  Send,
  AlertCircle,
  User,
  XCircle,
} from 'lucide-react';

const Settlements = () => {
  const [summary, setSummary] = useState({
    pendingShops: [],
    pendingPartners: [],
    pendingRefunds: [],
    unsettledOrdersCount: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settlement Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [settlementTarget, setSettlementTarget] = useState(null); // { type, id, name, amount, orderIds }
  const [notes, setNotes] = useState('');
  const [settling, setSettling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, histRes] = await Promise.all([
        api.get('/settlements/summary'),
        api.get('/settlements/history'),
      ]);
      setSummary({
        pendingShops: sumRes.data.pendingShops || [],
        pendingPartners: sumRes.data.pendingPartners || [],
        pendingRefunds: sumRes.data.pendingRefunds || [],
        unsettledOrdersCount: sumRes.data.unsettledOrdersCount || 0,
      });
      setHistory(histRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openSettleModal = (type, target) => {
    if (type === 'customer_refund') {
      setSettlementTarget({
        type: 'customer_refund',
        targetId: target.customer?._id || target.customer,
        name: target.customer?.name || 'Student',
        amount: target.totalAmount,
        orderCount: 1,
        orderIds: [target.orderId],
      });
      setNotes(
        `Bank refund settlement for cancelled Order #${target.orderId.slice(-6).toUpperCase()}`
      );
    } else {
      setSettlementTarget({
        type,
        targetId: type === 'shop' ? target.shopId : target.partnerId,
        name: type === 'shop' ? target.shopName : target.partnerName,
        amount: target.totalAmount,
        orderCount: target.orderCount,
        orderIds: target.orders,
      });
      setNotes(
        `End-of-day settlement for ${type === 'shop' ? target.shopName : target.partnerName}`
      );
    }
    setModalOpen(true);
  };

  const handleExecuteSettlement = async (e) => {
    e.preventDefault();
    setSettling(true);
    try {
      const res = await api.post('/settlements', {
        settlementType: settlementTarget.type,
        targetId: settlementTarget.targetId,
        totalAmount: settlementTarget.amount,
        orderIds: settlementTarget.orderIds,
        notes,
      });

      setSuccessMsg(res.data.message);
      setModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-emerald-600" />
            End-of-Day Financial Settlements & Refunds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Disburse daily canteen sales, delivery fees to riders, and full refunds for customer cancelled orders
          </p>
        </div>

        <button
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh Calculations
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* 1. PENDING CUSTOMER REFUNDS (CANCELLED ORDERS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Pending Customer Refunds ({summary.pendingRefunds.length})
            </h2>
            <p className="text-xs text-slate-500">
              Cancelled student orders requiring 100% full money refund disbursement
            </p>
          </div>
        </div>

        {summary.pendingRefunds.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No pending customer refunds. All cancelled orders are refunded!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Hostel Drop</th>
                  <th className="pb-3">Canteen</th>
                  <th className="pb-3">Cancellation Reason</th>
                  <th className="pb-3">Refund Due</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.pendingRefunds.map((ref) => (
                  <tr key={ref.orderId} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      #{ref.orderId.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-slate-900">{ref.customer?.name}</p>
                      <p className="text-[11px] text-slate-400">{ref.customer?.phone}</p>
                    </td>
                    <td className="py-3 text-slate-600">
                      {ref.customer?.hostel} ({ref.customer?.roomNumber})
                    </td>
                    <td className="py-3 text-slate-700 font-medium">
                      {ref.shopName}
                    </td>
                    <td className="py-3 text-slate-500 italic max-w-xs truncate">
                      "{ref.cancellationReason || 'Cancelled before shop acceptance'}"
                    </td>
                    <td className="py-3 font-black text-base text-rose-600">
                      ₹{ref.totalAmount}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => openSettleModal('customer_refund', ref)}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                      >
                        Refund ₹{ref.totalAmount}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. PENDING SHOP SETTLEMENTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-orange-500" />
              Pending Canteen & Shop Payouts ({summary.pendingShops.length})
            </h2>
            <p className="text-xs text-slate-500">
              Net food order amounts awaiting daily bank settlement
            </p>
          </div>
        </div>

        {summary.pendingShops.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            All shop food orders have been settled for the day.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Shop Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Delivered Orders</th>
                  <th className="pb-3">Amount Payable</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.pendingShops.map((shop) => (
                  <tr key={shop.shopId} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      {shop.shopName}
                    </td>
                    <td className="py-3 text-slate-500">{shop.category}</td>
                    <td className="py-3 text-slate-700 font-medium">
                      {shop.orderCount} orders
                    </td>
                    <td className="py-3 font-black text-base text-orange-600">
                      ₹{shop.totalAmount}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => openSettleModal('shop', shop)}
                        className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm"
                      >
                        Settle ₹{shop.totalAmount}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. PENDING DELIVERY PARTNER SETTLEMENTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-teal-600" />
              Pending Delivery Partner Disbursements ({summary.pendingPartners.length})
            </h2>
            <p className="text-xs text-slate-500">
              Delivery fees (₹50 per trip) accumulated by campus riders
            </p>
          </div>
        </div>

        {summary.pendingPartners.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            All delivery partner fees have been settled for the day.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Delivery Partner</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Delivered Trips</th>
                  <th className="pb-3">Fees Payable</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.pendingPartners.map((partner) => (
                  <tr key={partner.partnerId} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      {partner.partnerName}
                    </td>
                    <td className="py-3 text-slate-500">{partner.partnerPhone}</td>
                    <td className="py-3 text-slate-700 font-medium">
                      {partner.orderCount} trips
                    </td>
                    <td className="py-3 font-black text-base text-teal-600">
                      ₹{partner.totalAmount}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => openSettleModal('delivery_partner', partner)}
                        className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                      >
                        Settle ₹{partner.totalAmount}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. SETTLEMENT HISTORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
          Completed Settlement & Refund Ledger ({history.length})
        </h2>

        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No settlement records found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Recipient</th>
                  <th className="pb-3">Orders Included</th>
                  <th className="pb-3">Amount Settled</th>
                  <th className="pb-3">Notes</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-600">
                      {new Date(s.settledAt || s.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`capitalize font-bold px-2 py-0.5 rounded text-[10px] ${
                          s.settlementType === 'shop'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : s.settlementType === 'delivery_partner'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.settlementType === 'shop'
                          ? '🏪 Shop Payout'
                          : s.settlementType === 'delivery_partner'
                          ? '🚴 Rider Fee'
                          : '💰 Customer Refund'}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {s.settlementType === 'shop'
                        ? s.shop?.name || 'Shop'
                        : s.settlementType === 'delivery_partner'
                        ? s.deliveryPartner?.name || 'Partner'
                        : s.customer?.name || 'Student'}
                    </td>
                    <td className="py-3 text-slate-600">{s.orderCount} orders</td>
                    <td className="py-3 font-black text-slate-900">
                      ₹{s.totalAmount}
                    </td>
                    <td className="py-3 text-slate-500 italic max-w-xs truncate">
                      {s.notes}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SETTLEMENT CONFIRMATION MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Execute Settlement: ${settlementTarget?.name}`}
      >
        <form onSubmit={handleExecuteSettlement} className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {settlementTarget?.type === 'customer_refund'
                ? 'Full Customer Refund Amount'
                : 'Settlement Amount'}
            </p>
            <p className="text-3xl font-black text-emerald-600">
              ₹{settlementTarget?.amount}
            </p>
            <p className="text-xs text-emerald-700">
              {settlementTarget?.type === 'customer_refund'
                ? `Disbursing money to ${settlementTarget?.name}`
                : `Disbursing for ${settlementTarget?.orderCount} delivered orders`}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Settlement Notes / Transaction Ref
            </label>
            <input
              type="text"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={settling}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {settling
                ? 'Processing...'
                : settlementTarget?.type === 'customer_refund'
                ? 'Disburse Full Refund'
                : 'Confirm & Settle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settlements;
