import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Circle, ChevronRight, ArrowLeft, Package } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">Order Not Found</h2>
        <Link to="/" className="btn-primary">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/account?tab=orders" className="flex items-center gap-1 text-sm text-surface-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold font-display text-surface-900">Order Tracking</h1>
            <p className="text-sm text-surface-500 font-mono mt-1">Order ID: {order.id}</p>
          </div>
          <div className={`badge ${
            order.status === 'delivered' ? 'badge-success' :
            order.status === 'shipped' || order.status === 'out_for_delivery' ? 'badge-info' :
            'badge-warning'
          }`}>
            {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="relative ml-4 sm:ml-8">
          {order.trackingHistory.map((step, idx) => (
            <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
              {/* Line & Dot */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  step.completed
                    ? 'gradient-brand text-white'
                    : 'bg-surface-100 text-surface-400'
                }`}>
                  {step.completed ? <Check size={16} /> : <Circle size={16} />}
                </div>
                {idx < order.trackingHistory.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1 ${
                    step.completed && order.trackingHistory[idx + 1]?.completed
                      ? 'bg-brand-400'
                      : 'bg-surface-200'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="pt-1 pb-2">
                <p className={`text-sm font-semibold ${step.completed ? 'text-surface-900' : 'text-surface-400'}`}>
                  {step.label}
                </p>
                {step.completed && step.date && (
                  <p className="text-xs text-surface-500 mt-0.5">
                    {new Date(step.date).toLocaleDateString('en-IN', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Items */}
        <div className="mt-8 pt-6 border-t border-surface-100">
          <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Package size={16} /> Order Items
          </h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-surface-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{item.productName}</p>
                  <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-surface-100 flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-brand-600">₹{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
