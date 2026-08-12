import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, CreditCard, Truck, User, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders, generateTrackingHistory } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { paymentService, paymentMethodLabels } from '../services/PaymentService';
import { Address, CustomerDetails, PaymentMethodType, Order, OrderItem } from '../types';
import toast from 'react-hot-toast';

const steps = [
  { label: 'Customer Details', icon: User },
  { label: 'Delivery Address', icon: Truck },
  { label: 'Order Summary', icon: ClipboardList },
  { label: 'Payment Method', icon: CreditCard },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, totalDiscount, deliveryCharge, grandTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
  });

  const [address, setAddress] = useState<Address>({
    id: `addr_${Date.now()}`,
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!customer.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!customer.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      else if (!/^\d{10}$/.test(customer.mobile.trim())) newErrors.mobile = 'Enter a valid 10-digit number';
      if (!customer.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) newErrors.email = 'Enter a valid email';
    }

    if (currentStep === 1) {
      if (!address.house.trim()) newErrors.house = 'House/Building is required';
      if (!address.street.trim()) newErrors.street = 'Street is required';
      if (!address.city.trim()) newErrors.city = 'City is required';
      if (!address.state.trim()) newErrors.state = 'State is required';
      if (!address.pinCode.trim()) newErrors.pinCode = 'PIN Code is required';
      else if (!/^\d{6}$/.test(address.pinCode.trim())) newErrors.pinCode = 'Enter a valid 6-digit PIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const result = await paymentService.initiate(grandTotal, paymentMethod);
      if (result.success) {
        const estDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

        const orderItems: OrderItem[] = items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          sku: item.product.id ? `SKU-${item.product.id.toUpperCase()}` : 'SKU-ITEM',
          category: item.product.category || 'General',
          quantity: item.quantity,
          price: item.product.sellingPrice,
          mrp: item.product.mrp,
          discount: item.product.discount || 0,
          estimatedDelivery: estDelivery,
        }));

        const order: Order = {
          id: `ORD${Date.now().toString().slice(-8)}`,
          userId: user?.id || 'guest',
          customerName: customer.fullName,
          email: customer.email,
          phone: customer.mobile,
          items: orderItems,
          subtotal,
          discount: totalDiscount,
          deliveryCharge,
          total: grandTotal,
          address,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          status: 'placed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: estDelivery,
          trackingHistory: generateTrackingHistory('placed'),
        };

        addOrder(order);
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.id}`);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const inputClass = (field: string) =>
    `input-field ${errors[field] ? 'ring-2 ring-red-400 border-red-300' : ''}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold font-display text-surface-900 mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                idx < currentStep ? 'gradient-brand text-white' :
                idx === currentStep ? 'bg-brand-500 text-white ring-4 ring-brand-100' :
                'bg-surface-100 text-surface-400'
              }`}>
                {idx < currentStep ? <Check size={18} /> : <step.icon size={18} />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                idx <= currentStep ? 'text-brand-600' : 'text-surface-400'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${
                idx < currentStep ? 'gradient-brand' : 'bg-surface-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="card p-6 sm:p-8">
        {/* Step 1: Customer Details */}
        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-surface-800">Customer Details</h2>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Full Name *</label>
              <input type="text" value={customer.fullName} onChange={e => setCustomer({...customer, fullName: e.target.value})} className={inputClass('fullName')} placeholder="Enter your full name" />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Mobile Number *</label>
              <input type="tel" value={customer.mobile} onChange={e => setCustomer({...customer, mobile: e.target.value})} className={inputClass('mobile')} placeholder="10-digit mobile number" maxLength={10} />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
              <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className={inputClass('email')} placeholder="your@email.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Delivery Address */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-surface-800">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">House / Building *</label>
                <input type="text" value={address.house} onChange={e => setAddress({...address, house: e.target.value})} className={inputClass('house')} placeholder="Flat, House No., Building" />
                {errors.house && <p className="text-xs text-red-500 mt-1">{errors.house}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Street *</label>
                <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className={inputClass('street')} placeholder="Street name" />
                {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Area / Locality</label>
                <input type="text" value={address.area} onChange={e => setAddress({...address, area: e.target.value})} className="input-field" placeholder="Area / Locality" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">City *</label>
                <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className={inputClass('city')} placeholder="City" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">State *</label>
                <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className={inputClass('state')} placeholder="State" />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">PIN Code *</label>
                <input type="text" value={address.pinCode} onChange={e => setAddress({...address, pinCode: e.target.value})} className={inputClass('pinCode')} placeholder="6-digit PIN" maxLength={6} />
                {errors.pinCode && <p className="text-xs text-red-500 mt-1">{errors.pinCode}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Landmark</label>
              <input type="text" value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} className="input-field" placeholder="Near..." />
            </div>
          </div>
        )}

        {/* Step 3: Order Summary */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-surface-800">Order Summary</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 py-3 border-b border-surface-100 last:border-0">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-surface-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-surface-500">Qty: {quantity}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold">₹{(product.sellingPrice * quantity).toLocaleString()}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-surface-400 line-through">₹{(product.mrp * quantity).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-600">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Discount</span><span className="text-green-600">−₹{totalDiscount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Delivery</span><span className={deliveryCharge === 0 ? 'text-green-600' : ''}>{ deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
              <hr className="border-surface-200" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
            </div>
          </div>
        )}

        {/* Step 4: Payment Method */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-surface-800">Payment Method</h2>
            <p className="text-sm text-surface-500">Select your preferred payment method</p>
            <div className="space-y-3">
              {(Object.entries(paymentMethodLabels) as [PaymentMethodType, string][]).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === key
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={key}
                    checked={paymentMethod === key}
                    onChange={() => setPaymentMethod(key)}
                    className="w-4 h-4 text-brand-500 focus:ring-brand-400"
                  />
                  <div>
                    <p className="text-sm font-medium text-surface-800">{label}</p>
                    {key === 'cod' && <p className="text-xs text-surface-500">Pay when your order arrives</p>}
                    {key === 'upi' && <p className="text-xs text-surface-500">Pay using UPI apps (coming soon)</p>}
                    {key === 'online' && <p className="text-xs text-surface-500">Debit/Credit Card, Net Banking (coming soon)</p>}
                    {key === 'other' && <p className="text-xs text-surface-500">Wallet, EMI, etc. (coming soon)</p>}
                  </div>
                </label>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Payment gateway integration is coming soon. Currently, all payment methods are mock/demo only.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-100">
          {currentStep > 0 ? (
            <button onClick={handleBack} className="btn-ghost">
              ← Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="btn-primary flex items-center gap-2 min-w-[180px] justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
