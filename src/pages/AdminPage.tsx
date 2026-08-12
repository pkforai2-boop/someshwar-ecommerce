import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tags, TrendingUp,
  Plus, Edit2, Trash2, Eye, ChevronDown, X, Save, ArrowLeft,
  CheckCircle2, Circle, Truck, CreditCard, User as UserIcon, MapPin,
  Calendar, DollarSign, Tag, Check, ArrowRight, ShieldCheck, Clock, FileText,
  Upload, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { products as allProducts } from '../data/products';
import { categories } from '../data/categories';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { Product, OrderStatus, Order, PaymentStatusType } from '../types';
import { paymentMethodLabels } from '../services/PaymentService';
import toast from 'react-hot-toast';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories' | 'customers';

const trackingSteps: { status: OrderStatus; label: string }[] = [
  { status: 'placed', label: 'Order Placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'packed', label: 'Packed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
];

const AdminPage: React.FC = () => {
  const { subtab } = useParams<{ subtab?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (subtab && ['dashboard', 'products', 'orders', 'categories', 'customers'].includes(subtab)) {
      return subtab as AdminTab;
    }
    const tabParam = searchParams.get('tab') as AdminTab;
    if (tabParam && ['dashboard', 'products', 'orders', 'categories', 'customers'].includes(tabParam)) {
      return tabParam;
    }
    return 'dashboard';
  });

  useEffect(() => {
    if (subtab && ['dashboard', 'products', 'orders', 'categories', 'customers'].includes(subtab)) {
      setActiveTab(subtab as AdminTab);
    } else {
      const tabParam = searchParams.get('tab') as AdminTab;
      if (tabParam && ['dashboard', 'products', 'orders', 'categories', 'customers'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [subtab, searchParams]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
  };

  const { orders, updateOrderStatus } = useOrders();
  const { allProducts: productsList, addProduct: contextAddProduct, updateProduct: contextUpdateProduct, deleteProduct: contextDeleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Product Image Upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // File Upload Handler (Base64 conversion via FileReader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          if (isEdit && editingProduct) {
            setEditingProduct(prev => prev ? { ...prev, images: [...prev.images, dataUrl] } : null);
          } else {
            setUploadedImages(prev => [...prev, dataUrl]);
          }
          toast.success(`Image "${file.name}" uploaded successfully!`);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  // Add Image via URL input
  const handleAddImageUrl = (isEdit = false) => {
    const url = imageUrlInput.trim();
    if (!url) {
      toast.error('Please enter an image URL');
      return;
    }
    if (isEdit && editingProduct) {
      setEditingProduct(prev => prev ? { ...prev, images: [...prev.images, url] } : null);
    } else {
      setUploadedImages(prev => [...prev, url]);
    }
    setImageUrlInput('');
    toast.success('Image URL added!');
  };

  // Remove uploaded image
  const removeUploadedImage = (index: number, isEdit = false) => {
    if (isEdit && editingProduct) {
      setEditingProduct(prev => {
        if (!prev) return null;
        const newImgs = prev.images.filter((_, i) => i !== index);
        return { ...prev, images: newImgs };
      });
    } else {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    }
    toast.success('Image removed');
  };

  // Admin authentication state
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('someshwar_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin') {
      sessionStorage.setItem('someshwar_admin_auth', 'true');
      setIsAuthorized(true);
      setPasswordError('');
      toast.success('Admin login successful!');
    } else {
      setPasswordError('Incorrect admin password! Please try again.');
      toast.error('Access denied! Wrong password.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('someshwar_admin_auth');
    setIsAuthorized(false);
    setPasswordInput('');
    toast.success('Logged out from Admin Panel');
  };

  const stats = useMemo(() => ({
    totalProducts: productsList.length,
    totalOrders: orders.length,
    totalCustomers: new Set(orders.map(o => o.email)).size || 1,
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status !== 'delivered').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
  }), [orders, productsList]);

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'products', label: 'Products', icon: <Package size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { key: 'categories', label: 'Categories', icon: <Tags size={18} /> },
    { key: 'customers', label: 'Customers', icon: <Users size={18} /> },
  ];

  const handleDeleteProduct = (id: string) => {
    contextDeleteProduct(id);
    toast.success('Product deleted successfully');
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    toast.success(`Order status updated to ${status.replace(/_/g, ' ')}`);
  };

  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', category: 'Electronics', mrp: '', discount: '', stock: '', description: '',
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.mrp) {
      toast.error('Please fill required fields (Name, Brand, MRP)');
      return;
    }
    const mrp = parseFloat(newProduct.mrp);
    const discount = parseFloat(newProduct.discount) || 0;
    const finalImages = uploadedImages.length > 0
      ? uploadedImages
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'];

    const product: Product = {
      id: `p_${Date.now()}`,
      name: newProduct.name,
      brand: newProduct.brand,
      category: newProduct.category,
      description: newProduct.description,
      images: finalImages,
      mrp,
      discount,
      sellingPrice: Math.round(mrp * (1 - discount / 100)),
      rating: 4.5,
      reviewCount: 1,
      reviews: [],
      stock: parseInt(newProduct.stock) || 10,
      specifications: {},
      tags: [newProduct.category.toLowerCase(), newProduct.brand.toLowerCase()],
      status: 'active',
    };

    contextAddProduct(product);
    setNewProduct({ name: '', brand: '', category: 'Electronics', mrp: '', discount: '', stock: '', description: '' });
    setUploadedImages([]);
    setImageUrlInput('');
    setShowProductForm(false);
    toast.success('Product added successfully!');
  };

  const handleSaveEditedProduct = () => {
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.brand || !editingProduct.mrp) {
      toast.error('Please fill required fields');
      return;
    }

    contextUpdateProduct(editingProduct.id, {
      name: editingProduct.name,
      brand: editingProduct.brand,
      category: editingProduct.category,
      mrp: editingProduct.mrp,
      discount: editingProduct.discount,
      stock: editingProduct.stock,
      description: editingProduct.description,
      images: editingProduct.images.length > 0
        ? editingProduct.images
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
      status: editingProduct.status || 'active',
    });

    setEditingProduct(null);
    toast.success('Product updated successfully!');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // If not authorized, render login screen
  if (!isAuthorized) {
    return (
      <div className="min-h-[calc(100vh-220px)] flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="card w-full max-w-md p-8 border-2 border-brand-100 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-brand-600 shadow-inner">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="text-2xl font-bold font-display text-surface-900">Admin Panel Access</h2>
            <p className="text-sm text-surface-500 mt-1">Please enter the Admin Password to continue</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Admin Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Enter password"
                className="input-field text-center font-mono text-lg tracking-wider"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-red-500 font-medium mt-1 text-center animate-shake">{passwordError}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-base shadow-md hover:shadow-lg">
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-surface-900">Admin Panel</h1>
            <p className="text-sm text-surface-500">Someshwar E-Commerce Management</p>
          </div>
        </div>

        <button
          onClick={handleAdminLogout}
          className="btn-ghost text-xs text-red-600 hover:bg-red-50 font-medium border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Exit Admin
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-3 space-y-1 sticky top-24">
            {tabs.map(t => (
              <button key={t.key} onClick={() => handleTabChange(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.key ? 'bg-brand-50 text-brand-600' : 'text-surface-600 hover:bg-surface-50'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-4">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Total Products', value: stats.totalProducts, color: 'bg-blue-50 text-blue-600', icon: Package },
                  { label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-50 text-purple-600', icon: ShoppingCart },
                  { label: 'Total Customers', value: stats.totalCustomers, color: 'bg-green-50 text-green-600', icon: Users },
                  { label: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, color: 'bg-amber-50 text-amber-600', icon: TrendingUp },
                  { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-orange-50 text-orange-600', icon: ShoppingCart },
                  { label: 'Delivered Orders', value: stats.deliveredOrders, color: 'bg-emerald-50 text-emerald-600', icon: Package },
                ].map(stat => (
                  <div key={stat.label} className="card p-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-surface-500">{stat.label}</p>
                        <p className="text-xl font-bold text-surface-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-800">Recent Orders</h3>
                  <button
                    onClick={() => handleTabChange('orders')}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-surface-500 text-sm">No orders yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-surface-200 bg-surface-50">
                          <th className="text-left py-2.5 px-3 text-surface-600 font-medium">Order ID</th>
                          <th className="text-left py-2.5 px-3 text-surface-600 font-medium">Customer</th>
                          <th className="text-left py-2.5 px-3 text-surface-600 font-medium">Amount</th>
                          <th className="text-left py-2.5 px-3 text-surface-600 font-medium">Status</th>
                          <th className="text-left py-2.5 px-3 text-surface-600 font-medium">Date</th>
                          <th className="text-right py-2.5 px-3 text-surface-600 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 6).map(order => (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className="border-b border-surface-100 last:border-0 hover:bg-brand-50/50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-3 font-mono text-brand-600 font-bold">{order.id}</td>
                            <td className="py-3 px-3 font-medium text-surface-800">{order.customerName}</td>
                            <td className="py-3 px-3 font-semibold text-surface-900">₹{order.total.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span className={`badge ${
                                order.status === 'delivered' ? 'badge-success' :
                                order.status === 'shipped' || order.status === 'out_for_delivery' ? 'badge-info' : 'badge-warning'
                              }`}>
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-surface-500">{formatDate(order.createdAt)}</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderId(order.id);
                                }}
                                className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-md transition-colors inline-flex items-center gap-1"
                              >
                                View Details →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-800">Products ({productsList.length})</h2>
                <button onClick={() => setShowProductForm(!showProductForm)} className="btn-primary text-sm flex items-center gap-2">
                  {showProductForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Product</>}
                </button>
              </div>

              {showProductForm && (
                <div className="card p-6 space-y-5 border-2 border-brand-200 shadow-md">
                  <h3 className="font-bold text-surface-900 text-base">Add New Product</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="input-field" placeholder="Product Name *" />
                    <input type="text" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                      className="input-field" placeholder="Brand *" />
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="input-field">
                      {categories.filter(c => c.slug !== 'all' && c.slug !== 'offers').map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <input type="number" value={newProduct.mrp} onChange={e => setNewProduct({...newProduct, mrp: e.target.value})}
                      className="input-field" placeholder="MRP (₹) *" />
                    <input type="number" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})}
                      className="input-field" placeholder="Discount (%)" />
                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="input-field" placeholder="Stock" />
                  </div>

                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="input-field" rows={3} placeholder="Description" />

                  {/* Product Image Upload Section */}
                  <div className="space-y-3 pt-2 border-t border-surface-200/80">
                    <label className="block text-sm font-semibold text-surface-800">
                      Product Images (Upload File or Enter URL)
                    </label>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* File Upload Dropzone Box */}
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-brand-300 hover:border-brand-500 bg-brand-50/40 hover:bg-brand-50 rounded-xl cursor-pointer transition-all text-center group">
                        <Upload size={26} className="text-brand-500 group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-sm font-semibold text-surface-800">Choose Image File(s)</span>
                        <span className="text-[11px] text-surface-500 mt-0.5">Select image from gallery / computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>

                      {/* Image URL Box */}
                      <div className="flex flex-col justify-center p-4 border border-surface-200 rounded-xl bg-surface-50 space-y-2">
                        <span className="text-xs font-semibold text-surface-700 flex items-center gap-1">
                          <LinkIcon size={14} className="text-brand-600" /> Or Add Image Link URL
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="input-field text-xs py-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddImageUrl(false)}
                            className="btn-primary text-xs px-3 py-2 shrink-0 font-semibold"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview List */}
                    {uploadedImages.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-surface-600 mb-2">
                          Product Image Previews ({uploadedImages.length}):
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {uploadedImages.map((imgUrl, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-brand-300 group bg-surface-100 shadow-sm">
                              <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                              {idx === 0 && (
                                <span className="absolute top-1 left-1 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                  Main
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(idx, false)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-surface-200/80 flex gap-3">
                    <button onClick={handleAddProduct} className="btn-primary flex items-center gap-2 px-6">
                      <Save size={16} /> Save Product
                    </button>
                    <button onClick={() => setShowProductForm(false)} className="btn-ghost text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-50 border-b border-surface-200">
                        <th className="text-left py-3 px-4 text-surface-600 font-medium">Product</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium hidden sm:table-cell">Category</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium">Price</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium hidden md:table-cell">Stock</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map(product => (
                        <tr key={product.id} className="border-b border-surface-100 last:border-0 hover:bg-surface-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-surface-100 border border-surface-200" />
                              <div className="min-w-0">
                                <p className="font-medium text-surface-800 truncate max-w-[200px]">{product.name}</p>
                                <p className="text-xs text-surface-500">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell text-surface-600">{product.category}</td>
                          <td className="py-3 px-4">
                            <p className="font-semibold">₹{product.sellingPrice.toLocaleString()}</p>
                            {product.discount > 0 && <p className="text-xs text-surface-400 line-through">₹{product.mrp.toLocaleString()}</p>}
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <button onClick={() => setEditingProduct(product)}
                                className="w-8 h-8 rounded-lg text-surface-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)}
                                className="w-8 h-8 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Management */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-800">Orders Management ({orders.length})</h2>
              </div>

              {orders.length === 0 ? (
                <div className="card p-10 text-center">
                  <ShoppingCart size={48} className="mx-auto text-surface-300 mb-4" />
                  <p className="text-surface-500">No orders placed yet</p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface-50 border-b border-surface-200">
                          <th className="text-left py-3 px-4 text-surface-600 font-medium">Order ID</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium">Customer</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium hidden sm:table-cell">Products</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium hidden md:table-cell">Payment</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium hidden lg:table-cell">Delivery Date</th>
                          <th className="text-left py-3 px-4 text-surface-600 font-medium hidden xl:table-cell">Date</th>
                          <th className="text-right py-3 px-4 text-surface-600 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className="border-b border-surface-100 last:border-0 hover:bg-brand-50/50 cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono text-brand-600 font-bold">{order.id}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-surface-800">{order.customerName}</p>
                              <p className="text-xs text-surface-500">{order.phone}</p>
                            </td>
                            <td className="py-3.5 px-4 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-surface-700">{order.items.length} item(s)</span>
                                <div className="flex -space-x-2">
                                  {order.items.slice(0, 3).map(item => (
                                    <img key={item.productId} src={item.productImage} alt="" className="w-6 h-6 rounded-full border border-white object-cover" />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-surface-900">₹{order.total.toLocaleString()}</td>
                            <td className="py-3.5 px-4 hidden md:table-cell">
                              <div>
                                <span className="text-xs font-semibold text-surface-700 uppercase">{order.paymentMethod}</span>
                                <div>
                                  <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {(order.paymentStatus || (order.paymentMethod === 'cod' ? 'pending' : 'paid')).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                className="input-field text-xs py-1 px-2.5 w-auto border-surface-200 bg-white font-medium"
                              >
                                <option value="placed">Placed</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="packed">Packed</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-surface-600 font-medium">
                              {formatDate(order.estimatedDelivery)}
                            </td>
                            <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-surface-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedOrderId(order.id)}
                                className="btn-primary text-xs px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1 shadow-sm"
                              >
                                <Eye size={14} /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-800">Categories ({categories.length})</h2>
                <button className="btn-outline text-sm flex items-center gap-1"><Plus size={14} /> Add Category</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter(c => c.slug !== 'all').map(cat => (
                  <div key={cat.id} className="card p-4 flex items-center gap-4">
                    <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-surface-800">{cat.name}</p>
                      <p className="text-xs text-surface-500">{cat.productCount} products</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-lg text-surface-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {activeTab === 'customers' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold text-surface-800">Customers</h2>
              {orders.length === 0 ? (
                <div className="card p-10 text-center">
                  <Users size={48} className="mx-auto text-surface-300 mb-4" />
                  <p className="text-surface-500">No customers yet</p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-50 border-b border-surface-200">
                        <th className="text-left py-3 px-4 text-surface-600 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium hidden sm:table-cell">Email</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium">Orders</th>
                        <th className="text-left py-3 px-4 text-surface-600 font-medium hidden md:table-cell">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(new Map(orders.map(o => [o.email, o])).values()).map(order => {
                        const customerOrders = orders.filter(o => o.email === order.email);
                        const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
                        return (
                          <tr key={order.email} className="border-b border-surface-100 last:border-0">
                            <td className="py-3 px-4 font-medium">{order.customerName}</td>
                            <td className="py-3 px-4 hidden sm:table-cell text-surface-500">{order.email}</td>
                            <td className="py-3 px-4">{customerOrders.length}</td>
                            <td className="py-3 px-4 hidden md:table-cell font-semibold">₹{totalSpent.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE ORDER DETAILS MODAL                                              */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="card w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-surface-100 max-h-[90vh] flex flex-col overflow-hidden animate-scale-in my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 gradient-dark text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold font-mono tracking-wide">{selectedOrder.id}</h2>
                    <span className={`badge ${
                      selectedOrder.status === 'delivered' ? 'badge-success' :
                      selectedOrder.status === 'shipped' || selectedOrder.status === 'out_for_delivery' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-surface-300 mt-0.5">
                    Placed on {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* SECTION 1: ORDER STATUS TRACKING TIMELINE */}
              <div className="bg-surface-50 rounded-2xl p-5 border border-surface-200/80">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} className="text-brand-600" /> Order Tracking Timeline
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-surface-600 font-medium">Update Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      className="input-field text-xs py-1 px-3 border-brand-300 bg-white font-semibold text-brand-700 shadow-sm"
                    >
                      <option value="placed">Order Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Horizontal Timeline Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                  {trackingSteps.map((step, idx) => {
                    const statusIdx = trackingSteps.findIndex(s => s.status === selectedOrder.status);
                    const isCompleted = idx <= statusIdx;
                    const isCurrent = idx === statusIdx;

                    return (
                      <button
                        key={step.status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, step.status)}
                        className={`flex flex-col items-center text-center p-2 rounded-xl transition-all border ${
                          isCurrent
                            ? 'bg-brand-500 text-white border-brand-600 shadow-md scale-105'
                            : isCompleted
                            ? 'bg-brand-50 text-brand-700 border-brand-200'
                            : 'bg-white text-surface-400 border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                          isCurrent ? 'bg-white text-brand-600' : isCompleted ? 'bg-brand-500 text-white' : 'bg-surface-100 text-surface-400'
                        }`}>
                          {isCompleted ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className="text-[11px] font-medium leading-tight">{step.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: GRID FOR ORDER INFO, CUSTOMER INFO, DELIVERY ADDRESS */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* 1. ORDER INFORMATION */}
                <div className="bg-surface-50 rounded-xl p-4 border border-surface-200/60 space-y-2.5">
                  <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <FileText size={14} className="text-brand-600" /> Order Information
                  </h3>
                  <div>
                    <span className="text-xs text-surface-500">Order ID:</span>
                    <p className="font-mono font-bold text-brand-600 text-sm">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">Order Date:</span>
                    <p className="font-medium text-surface-800">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">Order Status:</span>
                    <p className="font-semibold capitalize text-brand-700">{selectedOrder.status.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">Expected Delivery:</span>
                    <p className="font-semibold text-emerald-700 flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(selectedOrder.estimatedDelivery)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">Total Amount:</span>
                    <p className="font-extrabold text-surface-900 text-base">₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* 2. CUSTOMER INFORMATION */}
                <div className="bg-surface-50 rounded-xl p-4 border border-surface-200/60 space-y-2.5">
                  <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <UserIcon size={14} className="text-brand-600" /> Customer Information
                  </h3>
                  <div>
                    <span className="text-xs text-surface-500">Customer Name:</span>
                    <p className="font-bold text-surface-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">Mobile Number:</span>
                    <p className="font-medium text-surface-800">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">Email Address:</span>
                    <p className="font-medium text-surface-800 break-all">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-surface-500">User Account:</span>
                    <p className="text-xs font-mono text-surface-600">{selectedOrder.userId}</p>
                  </div>
                </div>

                {/* 3. DELIVERY ADDRESS */}
                <div className="bg-surface-50 rounded-xl p-4 border border-surface-200/60 space-y-2.5">
                  <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <MapPin size={14} className="text-brand-600" /> Delivery Address
                  </h3>
                  <p className="font-bold text-surface-900">{selectedOrder.customerName}</p>
                  <p className="text-xs text-surface-700 leading-relaxed">
                    {selectedOrder.address.house}, {selectedOrder.address.street}<br />
                    {selectedOrder.address.area && `${selectedOrder.address.area}, `}
                    {selectedOrder.address.city}, {selectedOrder.address.state} - <span className="font-bold">{selectedOrder.address.pinCode}</span>
                    {selectedOrder.address.landmark && (
                      <><br /><span className="text-surface-500">Landmark:</span> {selectedOrder.address.landmark}</>
                    )}
                  </p>
                  <p className="text-xs text-surface-600 font-medium">📞 Mobile: {selectedOrder.phone}</p>
                </div>
              </div>

              {/* SECTION 3: PRODUCT DETAILS TABLE */}
              <div>
                <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Package size={14} className="text-brand-600" /> Product Details ({selectedOrder.items.length} item(s))
                </h3>
                <div className="border border-surface-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-surface-100 border-b border-surface-200 text-surface-600 font-semibold">
                          <th className="text-left py-2.5 px-3">Product</th>
                          <th className="text-left py-2.5 px-3">SKU / Category</th>
                          <th className="text-center py-2.5 px-3">Quantity</th>
                          <th className="text-right py-2.5 px-3">MRP</th>
                          <th className="text-right py-2.5 px-3">Selling Rate</th>
                          <th className="text-center py-2.5 px-3">Discount</th>
                          <th className="text-right py-2.5 px-3">Item Total</th>
                          <th className="text-left py-2.5 px-3">Expected Delivery</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100 bg-white">
                        {selectedOrder.items.map((item, idx) => {
                          const itemTotal = item.price * item.quantity;
                          const discountPct = item.discount !== undefined
                            ? item.discount
                            : (item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0);

                          return (
                            <tr key={idx} className="hover:bg-surface-50 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="w-12 h-12 rounded-lg object-cover bg-surface-50 border border-surface-200 shrink-0"
                                  />
                                  <span className="font-semibold text-surface-900 line-clamp-2 max-w-[200px] text-xs">
                                    {item.productName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <p className="font-mono text-[11px] font-bold text-surface-700">{item.sku || `SKU-${item.productId.toUpperCase()}`}</p>
                                <p className="text-[10px] text-surface-500">{item.category || 'General'}</p>
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-surface-900">{item.quantity}</td>
                              <td className="py-3 px-3 text-right text-surface-400 line-through">₹{item.mrp.toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-bold text-surface-900">₹{item.price.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center">
                                {discountPct > 0 ? (
                                  <span className="badge bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5">
                                    {discountPct}% OFF
                                  </span>
                                ) : (
                                  <span className="text-surface-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-extrabold text-brand-600 text-sm">
                                ₹{itemTotal.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 font-medium text-emerald-700">
                                {formatDate(item.estimatedDelivery || selectedOrder.estimatedDelivery)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PAYMENT DETAILS & PRICE BREAKDOWN */}
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                {/* PAYMENT DETAILS */}
                <div className="bg-surface-50 rounded-xl p-5 border border-surface-200/80 space-y-3">
                  <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard size={14} className="text-brand-600" /> Payment Details
                  </h3>

                  <div className="flex items-center justify-between py-2 border-b border-surface-200/60">
                    <span className="text-surface-600">Payment Method:</span>
                    <span className="font-bold text-surface-900 uppercase">
                      {paymentMethodLabels[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-surface-200/60">
                    <span className="text-surface-600">Payment Status:</span>
                    <span className={`badge ${
                      (selectedOrder.paymentStatus || (selectedOrder.paymentMethod === 'cod' ? 'pending' : 'paid')) === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                    }`}>
                      {(selectedOrder.paymentStatus || (selectedOrder.paymentMethod === 'cod' ? 'Pending' : 'Paid')).toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    <p className="font-semibold mb-0.5">ℹ️ Payment System Status:</p>
                    <p>Using Mock Payment Service. No real bank charges processed.</p>
                  </div>
                </div>

                {/* PRICE BREAKDOWN */}
                <div className="bg-surface-50 rounded-xl p-5 border border-surface-200/80 space-y-2.5">
                  <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <DollarSign size={14} className="text-brand-600" /> Price Breakdown
                  </h3>

                  <div className="flex justify-between text-surface-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-surface-900">₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-surface-600">
                    <span>Product Discount</span>
                    <span className="font-semibold text-green-600">−₹{selectedOrder.discount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-surface-600">
                    <span>Delivery Charge</span>
                    <span className={`font-semibold ${selectedOrder.deliveryCharge === 0 ? 'text-green-600' : 'text-surface-900'}`}>
                      {selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-surface-600">
                    <span>Other Charges</span>
                    <span className="font-semibold text-surface-900">₹0</span>
                  </div>

                  <hr className="border-surface-200 my-2" />

                  <div className="flex justify-between font-extrabold text-base text-surface-900">
                    <span>Grand Total</span>
                    <span className="text-brand-600">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-50 border-t border-surface-200 flex justify-between items-center shrink-0">
              <div className="text-xs text-surface-500">
                Created: {formatDateTime(selectedOrder.createdAt)}
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="btn-primary text-sm px-6 py-2 rounded-xl shadow"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PRODUCT MODAL WITH IMAGE UPLOAD                                     */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="card w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-surface-100 p-6 space-y-5 animate-scale-in my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-200 pb-3">
              <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                <Edit2 size={18} className="text-brand-600" /> Edit Product
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-surface-400 hover:text-surface-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Brand *</label>
                <input
                  type="text"
                  value={editingProduct.brand}
                  onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Category *</label>
                <select
                  value={editingProduct.category}
                  onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="input-field"
                >
                  {categories.filter(c => c.slug !== 'all' && c.slug !== 'offers').map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">MRP (₹) *</label>
                <input
                  type="number"
                  value={editingProduct.mrp}
                  onChange={e => setEditingProduct({...editingProduct, mrp: parseFloat(e.target.value) || 0})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={editingProduct.discount}
                  onChange={e => setEditingProduct({...editingProduct, discount: parseFloat(e.target.value) || 0})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">Description</label>
              <textarea
                value={editingProduct.description}
                onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                className="input-field"
                rows={3}
              />
            </div>

            {/* Edit Product Image Upload Section */}
            <div className="space-y-3 pt-2 border-t border-surface-200">
              <label className="block text-xs font-semibold text-surface-800">
                Product Images
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-brand-300 hover:border-brand-500 bg-brand-50/40 hover:bg-brand-50 rounded-xl cursor-pointer transition-all text-center">
                  <Upload size={18} className="text-brand-600" />
                  <span className="text-xs font-semibold text-surface-800">Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Image URL..."
                    className="input-field text-xs py-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImageUrl(true)}
                    className="btn-primary text-xs px-3 py-2 shrink-0 font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {editingProduct.images.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {editingProduct.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-surface-300 bg-surface-100 shrink-0">
                      <img src={imgUrl} alt={`Edit preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(idx, true)}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-surface-200">
              <button onClick={() => setEditingProduct(null)} className="btn-ghost text-sm">
                Cancel
              </button>
              <button onClick={handleSaveEditedProduct} className="btn-primary text-sm flex items-center gap-2 px-6">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
