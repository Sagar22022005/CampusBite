import React from 'react';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCheck,
  XCircle,
} from 'lucide-react';

const statusConfig = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    label: 'Order Placed (Pending)',
  },
  Accepted: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: CheckCircle2,
    label: 'Shop Accepted',
  },
  Preparing: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: ChefHat,
    label: 'Preparing in Kitchen',
  },
  Ready: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: PackageCheck,
    label: 'Ready for Pickup',
  },
  'Picked Up': {
    bg: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: Bike,
    label: 'Picked Up & On the Way',
  },
  Delivered: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCheck,
    label: 'Delivered to Hostel',
  },
  Rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
    label: 'Order Rejected',
  },
  Cancelled: {
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: XCircle,
    label: 'Cancelled (Refund Due)',
  },
};

const OrderStatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
