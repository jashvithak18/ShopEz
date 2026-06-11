import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#2563EB"/></linearGradient></defs>
                <rect x="20" y="25" width="28" height="50" rx="6" fill="url(#fg)"/>
                <rect x="52" y="25" width="28" height="50" rx="6" fill="#60A5FA"/>
                <circle cx="50" cy="50" r="8" fill="#1e293b"/>
                <circle cx="50" cy="50" r="4" fill="url(#fg)"/>
              </svg>
              <span className="font-bold text-[20px] tracking-tight text-white">Shop<span className="text-blue-400">EZ</span></span>
            </div>
          </Link>
          <p className="text-xs text-white/50 leading-relaxed max-w-xs font-sans font-medium mt-3">
            Smarter shopping starts here. Curated products, AI recommendations, and fast delivery.
          </p>
          <div className="text-xs text-white/50 space-y-1.5 pt-2 font-sans text-left">
            <p className="font-semibold text-white/80">📞 Helpline: 1800-123-4567</p>
            <p>✉️ support@shopez.in</p>
            <p className="text-[10px] leading-snug pt-1 text-white/40">ShopEZ HQ: Sector 5, HSR Layout, Bengaluru, KA 560102</p>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white/40 mb-4">Discover</h4>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li><Link to="/catalog" className="hover:text-brand-500 transition-colors">Catalog Products</Link></li>
            <li><Link to="/catalog?category=electronics" className="hover:text-brand-500 transition-colors">Electronics</Link></li>
            <li><Link to="/catalog?category=apparel" className="hover:text-brand-500 transition-colors">Apparel & Coats</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white/40 mb-4">Store Policies</h4>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li><a href="#" className="hover:text-brand-500 transition-colors">Shipping & Customs</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy and Security</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white/40 mb-4">Corporate</h4>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li><a href="#" className="hover:text-brand-500 transition-colors">Become a Seller</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Careers at ShopEZ</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Press Inquiries</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
        <p>&copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Prefs</a>
        </div>
      </div>
    </footer>
  );
}
