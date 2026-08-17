import React from 'react';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';

const STEPS = [
  { key: 'Pending', label: 'Order Placed', icon: Clock },
  { key: 'Accepted', label: 'Shop Accepted', icon: CheckCircle2 },
  { key: 'Preparing', label: 'Preparing', icon: ChefHat },
  { key: 'Ready', label: 'Ready for Pickup', icon: PackageCheck },
  { key: 'Picked Up', label: 'Picked Up', icon: Bike },
  { key: 'Delivered', label: 'Delivered', icon: CheckCheck },
];

const OrderTracker = ({ status, rejectionReason }) => {
  if (status === 'Rejected') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 my-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base font-bold text-rose-900">Order Rejected by Shop</h4>
            <p className="text-sm text-rose-700 mt-1 font-medium">
              Reason: <span className="italic font-normal">"{rejectionReason || 'Item unavailable or shop busy.'}"</span>
            </p>
            <p className="text-xs text-rose-500 mt-2">
              Any charged amounts have been refunded. You can try ordering from another campus shop.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'Cancelled') {
    return (
      <div className="bg-slate-100 border border-slate-300 rounded-2xl p-5 my-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-slate-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base font-bold text-slate-900">Order Cancelled by Customer</h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              You cancelled this order before the shop accepted it. Product stock has been restored.
            </p>
            <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl inline-block">
              💰 Full money refund is queued for Admin day-end settlement.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
        {/* Active Progress Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-700 -z-0"
          style={{
            width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const isPassed = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                  isCurrent
                    ? 'bg-orange-500 text-white ring-4 ring-orange-200 scale-110'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span
                className={`text-[11px] md:text-xs font-semibold mt-2 text-center max-w-[70px] md:max-w-[90px] leading-tight ${
                  isCurrent
                    ? 'text-orange-600 font-bold'
                    : isPassed
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
