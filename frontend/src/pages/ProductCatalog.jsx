import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Search, SlidersHorizontal, ArrowUpDown, Mic, Star, Heart, ArrowRight, Eye } from 'lucide-react';
import { CatalogSkeleton } from '../components/SkeletonLoader.jsx';

export default function ProductCatalog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);

  // Sync state with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const catParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    setCategory(catParam || '');
    setSearch(searchParam || '');
  }, [location.search]);

  // Fetch user wishlist if logged in
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/wishlist')
        .then(res => {
          if (res.data.success && res.data.wishlist?.products) {
            const ids = res.data.wishlist.products.map(p => typeof p === 'object' ? p._id : p);
            setWishlistProductIds(ids);
          }
        })
        .catch(err => console.error('Error fetching wishlist:', err));
    } else {
      setWishlistProductIds([]);
    }
  }, [isAuthenticated]);

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to manage your wishlist.');
      navigate('/auth');
      return;
    }
    try {
      const res = await axios.post('/api/wishlist', { productId });
      if (res.data.success && res.data.wishlist?.products) {
        const ids = res.data.wishlist.products.map(p => typeof p === 'object' ? p._id : p);
        setWishlistProductIds(ids);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleCategorySelect = (catIdOrSlug) => {
    const params = new URLSearchParams(window.location.search);
    if (catIdOrSlug) {
      params.set('category', catIdOrSlug);
    } else {
      params.delete('category');
    }
    params.delete('recommendations'); // clear recommendation flag if standard category selected
    navigate(`/catalog?${params.toString()}`);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const isRecs = new URLSearchParams(window.location.search).get('recommendations') === 'true';
      const isWishlist = new URLSearchParams(window.location.search).get('wishlist') === 'true';
      let res;
      if (isWishlist) {
        res = await axios.get('/api/wishlist');
        if (res.data.success && res.data.wishlist?.products) {
          setProducts(res.data.wishlist.products);
        }
      } else if (isRecs) {
        res = await axios.get('/api/ai/recommendations');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } else {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (sort) params.append('sort', sort);
        res = await axios.get(`/api/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sort, location.search]);

  useEffect(() => {
    axios.get('/api/products/categories')
      .then(res => {
        if (res.data.success) {
          setCategories(res.data.categories.filter(c => c.parent === null));
        }
      });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const delaySuggestions = setTimeout(() => {
      axios.get(`/api/products/suggestions?q=${search}`)
        .then(res => {
          if (res.data.success) {
            setSuggestions(res.data.suggestions);
          }
        });
    }, 200);
    return () => clearTimeout(delaySuggestions);
  }, [search]);

  const startVoiceSearch = () => {
    setVoiceSearchActive(true);
    setTimeout(() => {
      setVoiceSearchActive(false);
      setSearch('AeroBook');
    }, 2500);
  };

  // Helper check to see if a category matches active category state (supports id, name or slug matching)
  const isCategoryActive = (cat) => {
    if (!category) return false;
    return (
      category === cat._id || 
      category.toLowerCase() === cat.name.toLowerCase() || 
      category.toLowerCase() === cat.slug?.toLowerCase()
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 mt-16 space-y-16 min-h-screen">
      <div className="space-y-3">
        <h1 className="font-display font-light text-4xl sm:text-[46px] text-[#1A1A1A] leading-tight">Discovery Studio</h1>
        <p className="text-xs sm:text-[14px] text-[#1A1A1A]/40 font-display font-light italic tracking-wide">Curate device specifications and technical drops using advanced filtering layers.</p>
      </div>
      
      <div className="relative max-w-xl">
        <div className="flex items-center bg-white border border-[#1A1A1A]/5 rounded-2xl p-3 shadow-[0_8px_30px_rgba(26,26,26,0.015)] focus-within:ring-1 focus-within:ring-[#C9A86A]/30 focus-within:border-[#C9A86A]/30 transition-all">
          <Search className="w-4.5 h-4.5 text-[#1A1A1A]/30 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Query items (e.g. AeroBook, coats)..."
            className="flex-grow px-3 bg-transparent text-xs sm:text-sm focus:outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 font-sans font-light"
          />
          <button 
            onClick={startVoiceSearch} 
            className={`p-2 rounded-xl hover:bg-[#F7F4EE] text-[#1A1A1A]/40 transition-colors ${voiceSearchActive ? 'animate-bounce text-[#C9A86A]' : ''}`}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-black/5 rounded-2xl shadow-xl overflow-hidden z-20">
            {suggestions.map(sug => (
              <button
                key={sug.id}
                onClick={() => {
                  setSearch(sug.name);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-5 py-3.5 text-xs text-[#1A1A1A] hover:bg-[#F7F4EE] transition-colors flex items-center justify-between"
              >
                <span>{sug.name}</span>
                <span className="text-[9px] text-[#C9A86A] font-bold uppercase tracking-wider font-sans">{sug.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Scrollable Filters Sidebar */}
        <div className="space-y-8 lg:sticky lg:top-28 h-fit max-h-[calc(100vh-140px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black/10">
          <div className="flex items-center gap-2 pb-4 border-b border-black/5">
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-display font-light text-xl text-[#1A1A1A]">Faceted Filters</h3>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">Department</h4>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleCategorySelect('')} 
                className={`text-left text-xs py-2.5 px-3.5 rounded-xl transition-all ${!category ? 'bg-[#1A1A1A] text-[#F7F4EE] font-medium' : 'text-[#1A1A1A]/70 hover:bg-black/5 font-light'}`}
              >
                All Departments
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat._id)}
                  className={`text-left text-xs py-2.5 px-3.5 rounded-xl transition-all ${isCategoryActive(cat) ? 'bg-[#1A1A1A] text-[#F7F4EE] font-medium' : 'text-[#1A1A1A]/70 hover:bg-black/5 font-light'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 border-t border-black/5 pt-6">
            <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">Price Threshold (₹)</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-2.5 bg-white border border-black/5 rounded-xl text-xs font-sans font-light focus:outline-none"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-2.5 bg-white border border-black/5 rounded-xl text-xs font-sans font-light focus:outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-4 border-t border-black/5 pt-6">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
              <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">Sort Hierarchy</h4>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-black/5 rounded-xl text-xs font-sans font-light focus:outline-none"
            >
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Lowest first</option>
              <option value="price_desc">Price: Highest first</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {loading ? (
            <CatalogSkeleton />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(prod => (
                <div 
                  key={prod._id}
                  className="bg-white rounded-[32px] overflow-hidden border border-[#1A1A1A]/5 shadow-[0_8px_30px_rgba(26,26,26,0.01)] hover:shadow-[0_24px_48px_rgba(26,26,26,0.03)] transition-all duration-700 hover:-translate-y-1.5 flex flex-col h-full relative group card-premium"
                >
                  <div className="relative overflow-hidden aspect-square bg-[#F7F4EE]/50 p-6 flex items-center justify-center reflection-sweep">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(26,26,26,0.02)_0%,_transparent_75%)] opacity-60 pointer-events-none" />
                    
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="max-h-full max-w-full object-contain transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-104 group-hover:rotate-1 drop-shadow-[0_8px_16px_rgba(0,0,0,0.03)]" 
                    />
                    
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1.5px] z-10">
                      <Link 
                        to={`/product/${prod._id}`}
                        className="p-3.5 rounded-full bg-white text-[#1A1A1A] hover:bg-[#2563EB] hover:text-white transition-all shadow-md hover:scale-105 duration-300 cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </Link>
                    </div>
                    
                    <button 
                      onClick={() => handleToggleWishlist(prod._id)}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A]/40 hover:text-pink-500 transition-all shadow-sm z-10 cursor-pointer"
                      title="Add to Wishlist"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${wishlistProductIds.includes(prod._id) ? 'fill-pink-500 text-pink-500' : 'text-[#1A1A1A]/40'}`} />
                    </button>
                  </div>
                  
                  <div className="p-7 space-y-3.5 flex flex-col flex-grow bg-white">
                    <div className="flex items-center justify-between text-[9px] font-bold text-[#1A1A1A]/30 uppercase tracking-widest font-sans">
                      <span>{prod.seller?.storeName || 'AeroTech'}</span>
                      <span className="flex items-center gap-0.5 text-[#2563EB] px-2 py-0.5 rounded-full bg-[#2563EB]/5">
                        <Star className="w-3.5 h-3.5 fill-[#2563EB]" />
                        {prod.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-light text-xl text-[#1A1A1A] line-clamp-1 group-hover:text-[#2563EB] transition-colors duration-500 leading-snug">
                      {prod.name}
                    </h3>
                    
                    <p className="text-xs text-[#1A1A1A]/40 line-clamp-2 leading-relaxed flex-grow font-sans font-light">
                      {prod.description}
                    </p>
                    
                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                      <span className="font-display font-light text-xl text-[#1A1A1A] tracking-tight">
                        ₹{prod.basePrice}
                      </span>
                      
                      <Link 
                        to={`/product/${prod._id}`}
                        className="text-[12px] font-sans font-medium text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1 group/btn capitalize"
                      >
                        Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/5 space-y-4">
              <Search className="w-12 h-12 text-apple-dark/20 mx-auto" />
              <h3 className="font-display font-bold text-lg text-apple-dark">No Products Found</h3>
              <p className="text-xs text-apple-dark/50">Try removing search keywords or filters to fetch all items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
