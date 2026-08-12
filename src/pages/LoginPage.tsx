import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

type Tab = 'login' | 'register' | 'forgot';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, forgotPassword, isLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!loginForm.email) newErrors.email = 'Email is required';
    if (!loginForm.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!registerForm.name) newErrors.name = 'Name is required';
    if (!registerForm.email) newErrors.email = 'Email is required';
    if (!registerForm.phone) newErrors.phone = 'Phone is required';
    if (!registerForm.password) newErrors.password = 'Password is required';
    else if (registerForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (registerForm.password !== registerForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await register(registerForm.name, registerForm.email, registerForm.phone, registerForm.password);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrors({ email: 'Email is required' });
      return;
    }
    const result = await forgotPassword(forgotEmail);
    if (result.success) {
      toast.success(result.message);
      setTab('login');
    } else {
      toast.error(result.message);
    }
  };

  const inputClass = (field: string) =>
    `input-field pl-10 ${errors[field] ? 'ring-2 ring-red-400 border-red-300' : ''}`;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-2xl font-display">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-display text-surface-900 mt-4">
            {tab === 'login' && 'Welcome Back'}
            {tab === 'register' && 'Create Account'}
            {tab === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            {tab === 'login' && 'Sign in to your Someshwar account'}
            {tab === 'register' && 'Join Someshwar E-Commerce today'}
            {tab === 'forgot' && 'Enter your email to reset password'}
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {/* Tab Switcher */}
          {tab !== 'forgot' && (
            <div className="flex bg-surface-100 rounded-lg p-1 mb-6">
              <button onClick={() => { setTab('login'); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'login' ? 'bg-white shadow-sm text-surface-900' : 'text-surface-500'}`}>
                Login
              </button>
              <button onClick={() => { setTab('register'); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'register' ? 'bg-white shadow-sm text-surface-900' : 'text-surface-500'}`}>
                Register
              </button>
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  className={inputClass('email')} placeholder="Email address" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type={showPassword ? 'text' : 'password'} value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className={inputClass('password')} placeholder="Password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-surface-400 hover:text-surface-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div className="text-right">
                <button type="button" onClick={() => { setTab('forgot'); setErrors({}); }}
                  className="text-sm text-brand-600 hover:text-brand-700">
                  Forgot Password?
                </button>
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type="text" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  className={inputClass('name')} placeholder="Full name" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type="email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  className={inputClass('email')} placeholder="Email address" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type="tel" value={registerForm.phone} onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
                  className={inputClass('phone')} placeholder="Mobile number" maxLength={10} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type={showPassword ? 'text' : 'password'} value={registerForm.password}
                  onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  className={inputClass('password')} placeholder="Password (min 6 chars)" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-surface-400 hover:text-surface-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type="password" value={registerForm.confirmPassword}
                  onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className={inputClass('confirmPassword')} placeholder="Confirm password" />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* Forgot Password */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-surface-400" />
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  className={inputClass('email')} placeholder="Enter your email" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Send Reset Link'}
              </button>
              <button type="button" onClick={() => { setTab('login'); setErrors({}); }}
                className="btn-ghost w-full text-sm">
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
