import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { paymentMethodLabels } from '../services/PaymentService';

const OrderConfirmationPage: React.FC = () => {
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
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold font-display text-surface-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-surface-500">Thank you for shopping with Someshwar E-Commerce</p>
      </div>

      {/* Order Details Card */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-surface-100">
          <div>
            <p className="text-xs text-surface-500">Order ID</p>
            <p className="text-lg font-bold text-brand-600 font-mono">{order.id}</p>
          </div>
          <div className="badge-success">
            <CheckCircle2 size={12} className="mr-1" /> Confirmed
          </div>
        </div>

        {/* Customer */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-surface-600 mb-2">
              <Package size={16} /> Customer
            </div>
            <p className="text-sm text-surface-800 font-medium">{order.customerName}</p>
            <p className="text-sm text-surface-500">{order.email}</p>
            <p className="text-sm text-surface-500">{order.phone}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-surface-600 mb-2">
              <MapPin size={16} /> Delivery Address
            </div>
            <p className="text-sm text-surface-700">
              {order.address.house}, {order.address.street}<br />
              {order.address.area && `${order.address.area}, `}{order.address.city}<br />
              {order.address.state} - {order.address.pinCode}
              {order.address.landmark && <><br />Near: {order.address.landmark}</>}
            </p>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-sm font-medium text-surface-600 mb-3">Products</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-3 py-2">
                <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-lg object-cover bg-surface-50" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-surface-800 line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-surface-900">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-surface-600">Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-surface-600">Discount</span><span className="text-green-600">−₹{order.discount.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-surface-600">Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span></div>
          <hr className="border-surface-200" />
          <div className="flex justify-between font-bold text-base">
            <span>Total Amount</span><span className="text-brand-600">₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment & Delivery */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-surface-50 rounded-xl p-4">
            <CreditCard size={20} className="text-brand-500" />
            <div>
              <p className="text-xs text-surface-500">Payment Method</p>
              <p className="text-sm font-medium text-surface-800">{paymentMethodLabels[order.paymentMethod]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-50 rounded-xl p-4">
            <Truck size={20} className="text-brand-500" />
            <div>
              <p className="text-xs text-surface-500">Estimated Delivery</p>
              <p className="text-sm font-medium text-surface-800">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8 justify-center flex-wrap">
        <Link to={`/order-tracking/${order.id}`} className="btn-primary flex items-center gap-2">
          <Truck size={18} /> Track Order
        </Link>
        <Link to="/" className="btn-outline flex items-center gap-2">
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
