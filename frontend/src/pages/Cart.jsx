import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Trash2, ShieldCheck, Ticket, ArrowRight, Heart } from 'lucide-react';
import { setCart } from '../store/cartSlice.js';
export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [savedForLater, setSavedForLater] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.product?.basePrice * item.quantity), 0) || 0;
  const tax = Math.round(subtotal * 0.08);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + tax + shipping - discount;
  const handleUpdateQuantity = async (itemId, currentQty, increment) => {
    const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
    if (newQty === currentQty) return;
    try {
      const res = await axios.put('/api/cart', { itemId, quantity: newQty });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleRemoveItem = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/${itemId}`);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleSaveForLater = (item) => {
    setSavedForLater(prev => [...prev, item]);
    handleRemoveItem(item._id);
  };
  const handleMoveToCart = async (item) => {
    try {
      const res = await axios.post('/api/cart', {
        productId: item.product._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        setSavedForLater(prev => prev.filter(i => i._id !== item._id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await axios.post('/api/coupons/apply', { code: couponCode, cartTotal: subtotal });
      if (res.data.success) {
        setDiscount(res.data.discount);
        setAppliedCoupon(res.data.code);
        setCouponCode('');
        alert(`Coupon applied! You saved ₹${res.data.discount}`);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-32 px-6 space-y-6">
        <h2 className="font-display font-black text-2xl text-apple-dark">Your Shopping Bag is empty</h2>
        <p className="text-xs text-apple-dark/60">Sign in to check your active cart or start shopping now.</p>
        <Link to="/auth" className="block py-3 rounded-full bg-apple-dark hover:bg-brand-500 text-white text-xs font-semibold transition-colors">
          Sign In
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 min-h-screen">
      <h1 className="font-display font-black text-3xl sm:text-4xl text-apple-dark">Shopping Bag</h1>
      {cart?.items?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-black/5 shadow-sm hover:border-brand-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={item.product?.images[0]} alt={item.product?.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-apple-dark line-clamp-1">{item.product?.name}</h3>
                      <span className="text-[10px] text-apple-dark/50 block font-display">Variant: {item.color} / {item.size}</span>
                      <span className="text-xs font-semibold text-apple-dark block mt-1">₹{item.product?.basePrice}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center border border-black/10 rounded-xl bg-white">
                      <button onClick={() => handleUpdateQuantity(item._id, item.quantity, false)} className="px-3 py-1.5 text-xs font-bold text-apple-dark/60">-</button>
                      <span className="px-3 text-xs font-bold font-display">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item._id, item.quantity, true)} className="px-3 py-1.5 text-xs font-bold text-apple-dark/60">+</button>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleSaveForLater(item)} className="p-2 text-apple-dark/40 hover:text-brand-500 transition-colors" title="Save for Later">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRemoveItem(item._id)} className="p-2 text-apple-dark/40 hover:text-red-500 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {savedForLater.length > 0 && (
              <div className="border-t border-black/5 pt-12 space-y-6">
                <h3 className="font-display font-extrabold text-lg text-apple-dark">Saved For Later</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedForLater.map(item => (
                    <div key={item._id} className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm space-y-4">
                      <div className="flex gap-3">
                        <img src={item.product?.images[0]} alt={item.product?.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div>
                          <h4 className="font-display font-bold text-xs text-apple-dark line-clamp-1">{item.product?.name}</h4>
                          <span className="text-[10px] text-apple-dark/50 block">{item.color} / {item.size}</span>
                        </div>
                      </div>
                      <button onClick={() => handleMoveToCart(item)} className="w-full py-2 rounded-xl bg-apple-dark hover:bg-brand-500 text-white text-xs font-semibold transition-colors">
                        Move to Bag
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-md space-y-6">
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-apple-dark">Order Summary</h3>
              <div className="space-y-3.5 text-xs text-apple-dark/70 border-b border-black/5 pb-4">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-display font-semibold">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span className="font-display font-semibold">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="font-display font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>
              <div className="flex justify-between font-display text-base font-black text-apple-dark">
                <span>Estimated Total</span>
                <span>₹{total}</span>
              </div>
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Trash2 className="absolute left-3 top-3 w-4 h-4 text-apple-dark/30" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Apply SHOPEZ10 or WELCOME50"
                      className="w-full pl-9 pr-3 py-2.5 bg-brand-50 border border-black/10 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2.5 bg-apple-dark text-white rounded-xl text-xs font-semibold hover:bg-brand-500 transition-colors">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
                {appliedCoupon && <p className="text-[10px] text-emerald-600 font-semibold">Promo code {appliedCoupon} applied successfully!</p>}
              </form>
              <button 
                onClick={() => navigate('/checkout', { state: { discount, appliedCoupon, total } })}
                className="w-full py-3.5 rounded-full bg-apple-dark hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-apple-dark/40">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Checkout security encrypted</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-black/5 space-y-4 max-w-2xl mx-auto">
          <Trash2 className="w-12 h-12 text-apple-dark/20 mx-auto" />
          <h3 className="font-display font-bold text-lg text-apple-dark">Your Bag is empty</h3>
          <p className="text-xs text-apple-dark/50">Curate devices or premium technical coats on our discover catalog.</p>
          <Link to="/catalog" className="inline-block px-6 py-3 rounded-full bg-apple-dark text-white text-xs font-semibold hover:bg-brand-500 transition-colors">
            Discover catalog
          </Link>
        </div>
      )}
    </div>
  );
}
