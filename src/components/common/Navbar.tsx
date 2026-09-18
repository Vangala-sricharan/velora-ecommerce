import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, wishlistCount, currentUser, logout, isDarkMode, toggleTheme } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(navSearchQuery.trim())}`);
      setSearchOpen(false);
      setNavSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-slate-800'
            : 'bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900'
        }`}
      >
        {/* Top utility banner */}
        <div className="bg-slate-900 text-slate-300 dark:bg-slate-950 dark:text-slate-400 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-200">Personal Portfolio Project</span>
              <span className="hidden sm:inline text-slate-400">• Free shipping on orders over ₹1,000</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                id="navbar-admin-link"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Demo Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* LEFT: Brand Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                id="navbar-brand-logo"
                className="flex items-center gap-2.5 group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                  V
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-wider text-slate-950 dark:text-white uppercase font-sans">
                    VELORA
                  </span>
                  <span className="text-[10px] tracking-tight font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                    Shop smarter. Live better.
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER / DESKTOP Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" id="desktop-nav-links">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    id={`nav-link-${link.name.toLowerCase()}`}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                        : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Actions (Search, Theme, Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5" id="navbar-actions">
              {/* Search Toggle */}
              <button
                id="search-toggle-button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title="Search products"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Dark/Light Mode Toggle */}
              <button
                id="theme-toggle-button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                id="navbar-wishlist-button"
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span
                    id="navbar-wishlist-count"
                    className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 animate-in zoom-in-50"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                id="navbar-cart-button"
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title="Shopping Cart"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    id="navbar-cart-count"
                    className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 animate-in zoom-in-50"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                {currentUser ? (
                  <div className="relative">
                    <button
                      id="user-menu-button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {currentUser.fullName.charAt(0)}
                      </div>
                      <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                        {currentUser.fullName.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        id="user-dropdown-menu"
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {currentUser.fullName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          Profile Dashboard
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <Package className="w-4 h-4 text-slate-500" />
                          My Orders
                        </Link>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                          Admin Console
                        </Link>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    id="navbar-login-button"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                id="mobile-menu-toggle-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div
            id="navbar-search-bar"
            className="border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-3 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or specs (e.g., Headphones, Watch, Sneakers)..."
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-11 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-blue-600 dark:text-blue-400"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Demo Admin Panel
                </Link>
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 dark:text-slate-200"
                    >
                      <User className="w-5 h-5" />
                      My Profile ({currentUser.fullName})
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 dark:text-slate-200"
                    >
                      <Package className="w-5 h-5" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-rose-600 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold bg-blue-600 text-white"
                  >
                    <User className="w-5 h-5" />
                    Sign In to Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
