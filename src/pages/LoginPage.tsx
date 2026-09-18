import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, Shield, UserCheck, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Check if redirect was requested
  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Validation Error', 'Please provide both email and password.', 'warning');
      return;
    }

    login(email.trim(), password.trim(), email.includes('admin') ? 'admin' : 'customer');
    navigate(from, { replace: true });
  };

  const handleDemoUserLogin = () => {
    login('aarav.patel@example.com', 'password123', 'customer');
    navigate(from, { replace: true });
  };

  const handleDemoAdminLogin = () => {
    login('admin@velora.store', 'password123', 'admin');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20" id="login-page">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20 font-black text-xl">
            V
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back to VELORA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your orders, wishlist, and recommendations.
          </p>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
            Instant Demo Sign-in
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoUserLogin}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 hover:bg-blue-100/50 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Customer</span>
            </button>

            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 hover:bg-blue-100/50 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-sm text-blue-600 w-3.5 h-3.5"
              />
              <span>Remember me</span>
            </label>
            <span className="text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
