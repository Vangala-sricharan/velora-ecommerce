import React from 'react';
import { OrderStatus } from '../../types';
import { CheckCircle2, Clock, Truck, Package, Home, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/format';

interface OrderTimelineProps {
  status: OrderStatus | string;
  orderDate?: string;
  estimatedDelivery?: string;
}

const STAGES = [
  { id: 'placed', label: 'Order Placed', desc: 'Received & verified by VELORA', icon: Package },
  { id: 'processing', label: 'Processing', desc: 'Packed & quality checked', icon: Clock },
  { id: 'shipped', label: 'Shipped', desc: 'Handed over to carrier', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent on the way', icon: Truck },
  { id: 'delivered', label: 'Delivered', desc: 'Handed to recipient', icon: Home },
];

function getStageIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes('cancel')) return -1;
  if (s.includes('delivered')) return 4;
  if (s.includes('out for delivery') || s.includes('out_for_delivery')) return 3;
  if (s.includes('ship')) return 2;
  if (s.includes('process') || s.includes('confirmed')) return 1;
  return 0; // Order Placed
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  status,
  orderDate,
  estimatedDelivery,
}) => {
  const currentIndex = getStageIndex(status);
  const isCancelled = status.toLowerCase().includes('cancel');

  if (isCancelled) {
    return (
      <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3.5">
        <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
        <div>
          <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">Order Cancelled</h4>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
            This order has been cancelled and any paid amounts are processed for refund.
          </p>
        </div>
      </div>
    );
  }

  const baseDate = orderDate ? new Date(orderDate) : new Date();

  const getSimulatedTime = (stageIdx: number) => {
    const d = new Date(baseDate.getTime() + stageIdx * 14 * 60 * 60 * 1000);
    return formatDate(d.toISOString());
  };

  return (
    <div className="space-y-6" id="order-timeline-widget">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Tracking Status</span>
          <span className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            {status}
          </span>
        </div>
        {estimatedDelivery && (
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Expected Arrival</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {estimatedDelivery}
            </span>
          </div>
        )}
      </div>

      {/* Visual Step Tracker - Desktop / Horizontal */}
      <div className="hidden sm:grid grid-cols-5 relative pt-3 pb-2">
        <div className="absolute top-7 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500 rounded-full"
            style={{ width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 100}%` }}
          />
        </div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const IconComponent = stage.icon;

          return (
            <div key={stage.id} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950/60 shadow-lg'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs font-bold mt-2.5 block ${
                  isCurrent || isCompleted
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage.label}
              </span>
              <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[90px] mt-0.5">
                {idx <= currentIndex ? getSimulatedTime(idx) : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile / Vertical Step Tracker */}
      <div className="sm:hidden space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const IconComponent = stage.icon;

          return (
            <div key={stage.id} className="relative">
              <div
                className={`absolute -left-7 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  isCompleted
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-200 dark:ring-blue-900'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <IconComponent className="w-3 h-3" />}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent || isCompleted
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {idx <= currentIndex ? getSimulatedTime(idx) : 'Upcoming'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
