import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Heart, 
  Bell, 
  ChevronDown, 
  MapPin,
  Home as HomeIcon,
  Truck,
  Shield,
  Star,
  Zap
} from 'lucide-react';
import { logout } from '../store/authSlice.js';
import { clearCart } from '../store/cartSlice.js';
import { Logo } from './Logo.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const isHomeActive = location.pathname === '/';
  const isAddressActive = location.pathname === '/address';
  const isWishlistActive = location.pathname === '/catalog' && new URLSearchParams(location.search).get('wishlist') === 'true';
  const isCartActive = location.pathname === '/cart';
  const { cart } = useSelector(state => state.cart);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAddress, setActiveAddress] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const deptRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Fetch active address on login state change
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/address')
        .then(res => {
          if (res.data.success && res.data.addresses?.length > 0) {
            setActiveAddress(res.data.addresses[0]);
          } else {
            setActiveAddress(null);
          }
        })
        .catch(err => console.error("Error loading header address:", err));
    } else {
      setActiveAddress(null);
    }
  }, [isAuthenticated]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setDeptDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const departments = [
    'All', 'Fashion', 'Electronics', 'Gaming', 'Books', 'Beauty', 'Home Decor', 'Accessories', 'Sports'
  ];

  const notifications = [
    { id: 1, text: 'Your order for AeroPods Max was shipped!', time: '2 hrs ago', unread: true },
    { id: 2, text: 'Price drop alert: AeroBook Pro now ₹99,999!', time: '1 day ago', unread: false },
    { id: 3, text: 'Welcome to the new ShopEZ experience.', time: '2 days ago', unread: false }
  ];

  const unreadNotifsCount = notifications.filter(n => n.unread).length;
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    let url = '/catalog?';
    const params = [];
    if (searchQuery.trim()) {
      params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
    }
    if (selectedDept !== 'All') {
      params.push(`category=${encodeURIComponent(selectedDept.toLowerCase())}`);
    }
    url += params.join('&');
    navigate(url);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/80 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Logo (click for About) and Active Delivery Location */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <button onClick={() => setAboutOpen(true)} className="flex items-center focus:outline-none cursor-pointer" title="About ShopEZ">
            <Logo lightMode={true} />
          </button>
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1.5 text-left border-l border-slate-200 pl-4 py-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <div className="font-sans text-[11px] leading-tight">
                <span className="text-slate-400 block font-medium">Deliver to</span>
                <span className="text-slate-700 font-bold block truncate max-w-[120px]">
                  {activeAddress ? `${activeAddress.city}, ${activeAddress.postalCode}` : 'Select Address'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Large Prominent Search Bar (inspired by Amazon/Flipkart) */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex flex-grow max-w-2xl h-10 border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 rounded-lg overflow-hidden bg-slate-50 transition-all items-center"
        >
          {/* Department Select Dropdown Inside Search Bar */}
          <div ref={deptRef} className="relative h-full border-r border-slate-200 flex items-center bg-slate-100 hover:bg-slate-200/85">
            <button
              type="button"
              onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
              className="px-3.5 h-full text-[13px] font-sans font-medium text-slate-700 flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <span className="max-w-[80px] truncate">{selectedDept}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {deptDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-30 py-1.5">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setSelectedDept(dept);
                      setDeptDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-sans font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input field */}
          <input
            type="text"
            placeholder="Search thousands of premium items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none h-full"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="h-full bg-blue-600 hover:bg-blue-700 text-white px-5 flex items-center justify-center cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Side: Navigation & Utilities */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* Home link */}
          <Link
            to="/"
            className={`p-2 rounded-full transition-all flex items-center gap-1.5 font-sans text-xs font-semibold ${
              isHomeActive ? 'text-blue-600 bg-blue-50/60 shadow-sm border border-blue-100/30' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title="Home"
          >
            <HomeIcon className={`w-4.5 h-4.5 ${isHomeActive ? 'text-blue-600' : 'text-slate-600'}`} />
            <span className={`hidden lg:inline text-[13px] ${isHomeActive ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>Home</span>
          </Link>

          {/* Address link */}
          <Link
            to="/address"
            className={`p-2 rounded-full transition-all flex items-center gap-1.5 font-sans text-xs font-semibold ${
              isAddressActive ? 'text-blue-600 bg-blue-50/60 shadow-sm border border-blue-100/30' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title="My Addresses"
          >
            <MapPin className={`w-4.5 h-4.5 ${isAddressActive ? 'text-blue-600' : 'text-slate-600'}`} />
            <span className={`hidden lg:inline text-[13px] ${isAddressActive ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>Address</span>
          </Link>

          {/* Notifications Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
            {notifDropdownOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-76 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-30 py-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors flex flex-col gap-1 text-left ${
                        notif.unread ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <p className="text-[11px] font-sans font-medium text-slate-700 leading-snug">{notif.text}</p>
                      <span className="text-[9px] text-slate-400 font-semibold">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <Link
            to="/catalog?wishlist=true"
            className={`p-2 rounded-full transition-all flex items-center gap-1.5 font-sans text-xs font-semibold ${
              isWishlistActive ? 'text-pink-600 bg-pink-50/60 shadow-sm border border-pink-100/30' : 'text-slate-600 hover:text-red-500 hover:bg-slate-100'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4.5 h-4.5 ${isWishlistActive ? 'text-pink-600 fill-pink-500' : 'text-slate-600'}`} />
            <span className={`hidden lg:inline text-[13px] ${isWishlistActive ? 'text-pink-600 font-bold' : 'text-slate-700'}`}>Wishlist</span>
          </Link>

          {/* Cart Bag */}
          <Link 
            to="/cart" 
            className={`p-2 rounded-full transition-all flex items-center gap-1.5 font-sans text-xs font-semibold ${
              isCartActive ? 'text-blue-600 bg-blue-50/60 shadow-sm border border-blue-100/30' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title="Shopping Cart"
          >
            <ShoppingBag className={`w-4.5 h-4.5 ${isCartActive ? 'text-blue-600' : 'text-slate-600'}`} />
            <span className={`hidden lg:inline text-[13px] ${isCartActive ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Sign In / Profile dropdown */}
          <div ref={userRef} className="relative pl-2 border-l border-slate-200">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 text-[13px] font-sans font-semibold text-slate-700 hover:text-blue-600 focus:outline-none cursor-pointer"
                >
                  <span className="max-w-[70px] truncate capitalize">{user?.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-30 py-1.5">
                    {user?.role === 'seller' && (
                      <Link 
                        to="/dashboard/seller" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-sans font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        Seller Studio
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link 
                        to="/dashboard/admin" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-sans font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        Admin Console
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-sans font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-sans font-semibold transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden p-2 text-slate-700 hover:text-blue-600 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col justify-start px-6 py-20 space-y-6 pointer-events-auto md:hidden overflow-y-auto">
          <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-6 p-3 text-slate-700">
            <X className="w-6 h-6" />
          </button>
          
          {/* Mobile Search input */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="flex border border-slate-300 rounded-lg overflow-hidden h-10 w-full mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-3 bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileOpen(false)} className={`font-sans font-bold text-lg border-b border-slate-100 pb-3 flex items-center gap-2 ${isHomeActive ? 'text-blue-600' : 'text-slate-800'}`}>
            <HomeIcon className="w-5 h-5" /> Home
          </Link>
          <Link to="/address" onClick={() => setMobileOpen(false)} className={`font-sans font-bold text-lg border-b border-slate-100 pb-3 flex items-center gap-2 ${isAddressActive ? 'text-blue-600' : 'text-slate-800'}`}>
            <MapPin className="w-5 h-5" /> My Addresses
          </Link>
          <Link to="/catalog?wishlist=true" onClick={() => setMobileOpen(false)} className={`font-sans font-bold text-lg border-b border-slate-100 pb-3 flex items-center gap-2 ${isWishlistActive ? 'text-pink-600' : 'text-slate-800'}`}>
            <Heart className={`w-5 h-5 ${isWishlistActive ? 'text-pink-600 fill-pink-500' : 'text-slate-500'}`} /> My Wishlist
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'seller' && (
                <Link to="/dashboard/seller" onClick={() => setMobileOpen(false)} className="font-sans font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">
                  Seller Studio
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/dashboard/admin" onClick={() => setMobileOpen(false)} className="font-sans font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">
                  Admin Console
                </Link>
              )}
              <Link to="/cart" onClick={() => setMobileOpen(false)} className={`font-sans font-bold text-lg border-b border-slate-100 pb-3 flex justify-between ${isCartActive ? 'text-blue-600' : 'text-slate-800'}`}>
                <span>Shopping Cart</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileOpen(false); }} 
                className="font-sans font-bold text-lg text-red-600 text-left border-b border-slate-100 pb-3 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              onClick={() => setMobileOpen(false)} 
              className="w-full py-3 rounded-lg bg-blue-600 text-center text-white font-sans font-bold text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* About ShopEZ Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setAboutOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <button onClick={() => setAboutOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="25" width="28" height="50" rx="6" fill="white" fillOpacity="0.9"/>
                    <rect x="52" y="25" width="28" height="50" rx="6" fill="white" fillOpacity="0.6"/>
                    <circle cx="50" cy="50" r="8" fill="#1e40af"/>
                    <circle cx="50" cy="50" r="4" fill="white"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Shop<span className="text-blue-200">EZ</span></h2>
                  <p className="text-blue-200 text-[11px] font-medium">Smarter Shopping, Every Day</p>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                ShopEZ is a premium Indian e-commerce platform built to make online shopping fast, personalised, and delightful.
              </p>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Star,   label: '200+ Products',    sub: 'Curated catalog' },
                  { icon: Zap,    label: 'Flash Deals',      sub: 'Daily markdowns' },
                  { icon: Truck,  label: 'Fast Delivery',    sub: 'Pan-India shipping' },
                  { icon: Shield, label: 'Secure Payments',  sub: 'UPI & encrypted' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-[10px] text-slate-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">About Us</p>
                <p className="leading-relaxed">Founded in Bengaluru, ShopEZ brings together thousands of verified sellers and millions of products across Electronics, Fashion, Home Decor, Beauty, and more.</p>
                <p className="text-[10px] text-slate-400 pt-1">📍 Sector 5, HSR Layout, Bengaluru, KA 560102 &nbsp;·&nbsp; 📞 1800-123-4567</p>
              </div>

              <button onClick={() => setAboutOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer">
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
