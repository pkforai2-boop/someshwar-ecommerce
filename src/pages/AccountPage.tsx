import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { Address } from '../types';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';

const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser, addAddress, removeAddress } = useAuth();
  const { getUserOrders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    house: '', street: '', area: '', city: '', state: '', pinCode: '', landmark: '',
  });

  const userOrders = getUserOrders(user?.id, user?.email);

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">Please login to view your account</h2>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateUser({ name: profileForm.name, phone: profileForm.phone });
    setEditingProfile(false);
    toast.success('Profile updated!');
  };

  const handleAddAddress = () => {
    if (!addressForm.house || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      toast.error('Please fill required fields');
      return;
    }
    addAddress({ ...addressForm, id: `addr_${Date.now()}` });
    setAddressForm({ house: '', street: '', area: '', city: '', state: '', pinCode: '', landmark: '' });
    setShowAddressForm(false);
    toast.success('Address added!');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
    { key: 'orders', label: 'My Orders', icon: <Package size={18} /> },
    { key: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold font-display text-surface-900 mb-6">My Account</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-4 space-y-1">
            <div className="px-3 py-4 text-center border-b border-surface-100 mb-2">
              <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <p className="font-semibold text-surface-800">{user?.name}</p>
              <p className="text-xs text-surface-500">{user?.email}</p>
            </div>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.key ? 'bg-brand-50 text-brand-600' : 'text-surface-600 hover:bg-surface-50'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-surface-800">Profile Information</h2>
                <button onClick={() => { setEditingProfile(!editingProfile); setProfileForm({ name: user?.name || '', phone: user?.phone || '' }); }}
                  className="btn-ghost text-sm flex items-center gap-1">
                  {editingProfile ? 'Cancel' : <><Edit2 size={14} /> Edit</>}
                </button>
              </div>
              {editingProfile ? (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="input-field" />
                  </div>
                  <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2"><Save size={16} /> Save</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div><p className="text-xs text-surface-500">Name</p><p className="text-sm font-medium">{user?.name}</p></div>
                  <div><p className="text-xs text-surface-500">Email</p><p className="text-sm font-medium">{user?.email}</p></div>
                  <div><p className="text-xs text-surface-500">Phone</p><p className="text-sm font-medium">{user?.phone || 'Not set'}</p></div>
                  <div><p className="text-xs text-surface-500">Member Since</p><p className="text-sm font-medium">{new Date(user?.createdAt || '').toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold text-surface-800">My Orders ({userOrders.length})</h2>
              {userOrders.length === 0 ? (
                <div className="card p-10 text-center">
                  <Package size={48} className="mx-auto text-surface-300 mb-4" />
                  <p className="text-surface-500">No orders yet</p>
                  <Link to="/" className="btn-primary mt-4 inline-block">Start Shopping</Link>
                </div>
              ) : (
                userOrders.map(order => (
                  <div key={order.id} className="card p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <p className="text-sm font-mono text-brand-600 font-semibold">{order.id}</p>
                        <p className="text-xs text-surface-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className={`badge ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'shipped' || order.status === 'out_for_delivery' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                      {order.items.map(item => (
                        <img key={item.productId} src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-lg object-cover bg-surface-50 shrink-0" />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">₹{order.total.toLocaleString()}</p>
                      <Link to={`/order-tracking/${order.id}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                        Track Order →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-surface-800 mb-4">Wishlist ({wishlistItems.length})</h2>
              {wishlistItems.length === 0 ? (
                <div className="card p-10 text-center">
                  <Heart size={48} className="mx-auto text-surface-300 mb-4" />
                  <p className="text-surface-500">Your wishlist is empty</p>
                </div>
              ) : (
                <Link to="/wishlist" className="btn-primary">View Wishlist →</Link>
              )}
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-800">Saved Addresses</h2>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn-outline text-sm flex items-center gap-1">
                  <Plus size={14} /> Add Address
                </button>
              </div>
              {showAddressForm && (
                <div className="card p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" value={addressForm.house} onChange={e => setAddressForm({...addressForm, house: e.target.value})} className="input-field" placeholder="House / Building *" />
                    <input type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="input-field" placeholder="Street *" />
                    <input type="text" value={addressForm.area} onChange={e => setAddressForm({...addressForm, area: e.target.value})} className="input-field" placeholder="Area" />
                    <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="input-field" placeholder="City *" />
                    <input type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="input-field" placeholder="State *" />
                    <input type="text" value={addressForm.pinCode} onChange={e => setAddressForm({...addressForm, pinCode: e.target.value})} className="input-field" placeholder="PIN Code *" />
                  </div>
                  <input type="text" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} className="input-field" placeholder="Landmark" />
                  <div className="flex gap-2">
                    <button onClick={handleAddAddress} className="btn-primary text-sm">Save Address</button>
                    <button onClick={() => setShowAddressForm(false)} className="btn-ghost text-sm">Cancel</button>
                  </div>
                </div>
              )}
              {user?.addresses.length === 0 && !showAddressForm && (
                <div className="card p-10 text-center">
                  <MapPin size={48} className="mx-auto text-surface-300 mb-4" />
                  <p className="text-surface-500">No saved addresses</p>
                </div>
              )}
              {user?.addresses.map(addr => (
                <div key={addr.id} className="card p-4 flex justify-between items-start">
                  <p className="text-sm text-surface-700">
                    {addr.house}, {addr.street}{addr.area && `, ${addr.area}`}<br />
                    {addr.city}, {addr.state} - {addr.pinCode}
                    {addr.landmark && <><br />Near: {addr.landmark}</>}
                  </p>
                  <button onClick={() => { removeAddress(addr.id); toast.success('Address removed'); }}
                    className="text-surface-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="card p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-surface-800 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-surface-800">Email Notifications</p>
                    <p className="text-xs text-surface-500">Receive order updates via email</p>
                  </div>
                  <div className="w-10 h-6 bg-brand-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-surface-800">SMS Notifications</p>
                    <p className="text-xs text-surface-500">Receive order updates via SMS</p>
                  </div>
                  <div className="w-10 h-6 bg-surface-300 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>
                <hr className="border-surface-200" />
                <button onClick={handleLogout} className="text-red-600 text-sm font-medium hover:text-red-700">
                  Logout from all devices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
