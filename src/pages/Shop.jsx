import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Layers, CreditCard, Ruler, Verified, ArrowRight, SlidersHorizontal, ChevronLeft, Inbox, X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

// Texture noise pattern (embedded data URI)
const noisePattern = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E";

const Shop = () => {
  const { fetchShopProducts, wishlist, toggleWishlist, addToCart, categories, loadingCategories } = useApp();
  const navigate = useNavigate();

  const [shopProducts, setShopProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingShop, setLoadingShop] = useState(true);
  const [sortOption, setSortOption] = useState('newest');

  const [selectedCollections, setSelectedCollections] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  // Filter Group Accordion Open/Closed States
  const [openFilters, setOpenFilters] = useState({
    collections: true,
    price: true,
    size: true,
    region: true
  });

  // Quick View Product State
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [selectedPrices, setSelectedPrices] = useState({
    under50: false,
    fiftyToHundred: false,
    overHundred: false
  });
  const [selectedVolumes, setSelectedVolumes] = useState({
    '250ml': false,
    '500ml': false,
    '750ml': false,
    '1000ml': false
  });
  const [selectedRegions, setSelectedRegions] = useState({
    'Cap Bon': false,
    'Sahel': false,
    'Sfax': false,
    'Zaghouan': false
  });

  // Sync collections checkboxes when categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0) {
      const initial = {};
      categories.forEach((cat) => {
        initial[cat.name] = false;
      });
      setSelectedCollections(initial);
      setCurrentPage(1);
    }
  }, [categories]);

  // Load products based on filters
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingShop(true);
      const params = {
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        sort: sortOption
      };

      const activeCategoryIds = [];
      Object.keys(selectedCollections).forEach(catName => {
        if (selectedCollections[catName]) {
          const categoryObj = categories.find(c => c.name === catName);
          if (categoryObj) {
            activeCategoryIds.push(categoryObj._id);
          }
        }
      });
      if (activeCategoryIds.length > 0) {
        params.category = activeCategoryIds.join(',');
      }

      const activePrices = [];
      if (selectedPrices.under50) activePrices.push({ min: 0, max: 49.99 });
      if (selectedPrices.fiftyToHundred) activePrices.push({ min: 50, max: 100 });
      if (selectedPrices.overHundred) activePrices.push({ min: 100.01, max: 99999 });

      if (activePrices.length > 0 && activePrices.length < 3) {
        const minVal = Math.min(...activePrices.map(p => p.min));
        const maxVal = Math.max(...activePrices.map(p => p.max));
        params.minPrice = minVal;
        params.maxPrice = maxVal;
      }

      const activeVolumes = Object.keys(selectedVolumes).filter(vol => selectedVolumes[vol]);
      if (activeVolumes.length > 0) {
        params.volume = activeVolumes.join(',');
      }

      const activeRegions = Object.keys(selectedRegions).filter(reg => selectedRegions[reg]);
      if (activeRegions.length > 0) {
        params.region = activeRegions.join(',');
      }

      const result = await fetchShopProducts(params);
      setShopProducts(result.products || []);
      setTotalPages(result.pages || 1);
      setTotalProducts(result.total || 0);
      setLoadingShop(false);
    };

    if (categories && categories.length > 0) {
      loadProducts();
    }
  }, [currentPage, selectedCollections, selectedPrices, selectedVolumes, selectedRegions, sortOption, categories]);

  // Load typography dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleCheckboxChange = (name) => {
    setSelectedCollections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const resetObj = {};
    categories.forEach(cat => {
      resetObj[cat.name] = false;
    });
    setSelectedCollections(resetObj);

    setSelectedPrices({
      under50: false,
      fiftyToHundred: false,
      overHundred: false
    });

    setSelectedVolumes({
      '250ml': false,
      '500ml': false,
      '750ml': false,
      '1000ml': false
    });

    setSelectedRegions({
      'Cap Bon': false,
      'Sahel': false,
      'Sfax': false,
      'Zaghouan': false
    });

    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const toggleFilterGroup = (group) => {
    setOpenFilters(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Compute Active Filter Badges
  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(selectedCollections).forEach(val => { if (val) count++; });
    Object.values(selectedPrices).forEach(val => { if (val) count++; });
    Object.values(selectedVolumes).forEach(val => { if (val) count++; });
    Object.values(selectedRegions).forEach(val => { if (val) count++; });
    return count;
  };

  const activeFiltersCount = getActiveFilterCount();

  // Compute Removable Filter Chips
  const getActiveChips = () => {
    const chips = [];
    
    // Collections
    Object.keys(selectedCollections).forEach(name => {
      if (selectedCollections[name]) {
        chips.push({
          type: 'collections',
          key: name,
          label: name
        });
      }
    });
    
    // Prices
    if (selectedPrices.under50) chips.push({ type: 'price', key: 'under50', label: 'Under $50' });
    if (selectedPrices.fiftyToHundred) chips.push({ type: 'price', key: 'fiftyToHundred', label: '$50 - $100' });
    if (selectedPrices.overHundred) chips.push({ type: 'price', key: 'overHundred', label: 'Over $100' });
    
    // Volumes
    Object.keys(selectedVolumes).forEach(vol => {
      if (selectedVolumes[vol]) {
        chips.push({
          type: 'volumes',
          key: vol,
          label: vol
        });
      }
    });
    
    // Regions
    Object.keys(selectedRegions).forEach(reg => {
      if (selectedRegions[reg]) {
        chips.push({
          type: 'regions',
          key: reg,
          label: reg
        });
      }
    });
    
    return chips;
  };

  const activeChips = getActiveChips();

  const removeFilterChip = (chip) => {
    if (chip.type === 'collections') {
      setSelectedCollections(prev => ({ ...prev, [chip.key]: false }));
    } else if (chip.type === 'price') {
      setSelectedPrices(prev => ({ ...prev, [chip.key]: false }));
    } else if (chip.type === 'volumes') {
      setSelectedVolumes(prev => ({ ...prev, [chip.key]: false }));
    } else if (chip.type === 'regions') {
      setSelectedRegions(prev => ({ ...prev, [chip.key]: false }));
    }
    setCurrentPage(1);
  };

  // Generate Ellipsis Pagination Range
  const getPageNumbers = () => {
    const pages = [];
    const leftRange = Math.max(1, currentPage - 1);
    const rightRange = Math.min(totalPages, currentPage + 1);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= leftRange && i <= rightRange)) {
        pages.push(i);
      }
    }

    const rangeWithDots = [];
    let prev = null;

    for (const page of pages) {
      if (prev !== null) {
        if (page - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (page - prev > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  // Compute showing labels
  const startItem = totalProducts > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  // Modular JSX for filters (shared between desktop sidebar and mobile drawer)
  const renderFilterGroups = () => (
    <div className="space-y-6">
      
      {/* Filter Item: Collections */}
      <div className="border-b border-outline-variant/10 pb-4">
        <button 
          onClick={() => toggleFilterGroup('collections')}
          className="w-full flex items-center justify-between py-2 text-primary font-bold border-l-2 border-[#d4af37] pl-3 hover:text-secondary transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-secondary" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Collections</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-outline transition-transform duration-300 ${openFilters.collections ? 'rotate-180' : ''}`} />
        </button>
        <motion.div 
          initial={false}
          animate={{ height: openFilters.collections ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-3 space-y-2 ml-4">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-3 cursor-pointer group select-none">
                <input 
                  type="checkbox"
                  checked={!!selectedCollections[cat.name]}
                  onChange={() => handleCheckboxChange(cat.name)}
                  className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-background h-4 w-4"
                />
                <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-xs font-light ${selectedCollections[cat.name] ? 'text-primary font-semibold' : ''}`}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Price Range */}
      <div className="border-b border-outline-variant/10 pb-4">
        <button 
          onClick={() => toggleFilterGroup('price')}
          className="w-full flex items-center justify-between py-2 text-primary font-bold border-l-2 border-[#d4af37] pl-3 hover:text-secondary transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-secondary" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Price Range</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-outline transition-transform duration-300 ${openFilters.price ? 'rotate-180' : ''}`} />
        </button>
        <motion.div 
          initial={false}
          animate={{ height: openFilters.price ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-3 space-y-2 ml-4">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input 
                type="checkbox"
                checked={selectedPrices.under50}
                onChange={() => { setSelectedPrices(prev => ({ ...prev, under50: !prev.under50 })); setCurrentPage(1); }}
                className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
              />
              <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-xs font-light ${selectedPrices.under50 ? 'text-primary font-semibold' : ''}`}>
                Under $50
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input 
                type="checkbox"
                checked={selectedPrices.fiftyToHundred}
                onChange={() => { setSelectedPrices(prev => ({ ...prev, fiftyToHundred: !prev.fiftyToHundred })); setCurrentPage(1); }}
                className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
              />
              <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-xs font-light ${selectedPrices.fiftyToHundred ? 'text-primary font-semibold' : ''}`}>
                $50 - $100
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input 
                type="checkbox"
                checked={selectedPrices.overHundred}
                onChange={() => { setSelectedPrices(prev => ({ ...prev, overHundred: !prev.overHundred })); setCurrentPage(1); }}
                className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
              />
              <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-xs font-light ${selectedPrices.overHundred ? 'text-primary font-semibold' : ''}`}>
                Over $100
              </span>
            </label>
          </div>
        </motion.div>
      </div>

      {/* Bottle Size */}
      <div className="border-b border-outline-variant/10 pb-4">
        <button 
          onClick={() => toggleFilterGroup('size')}
          className="w-full flex items-center justify-between py-2 text-primary font-bold border-l-2 border-[#d4af37] pl-3 hover:text-secondary transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-secondary" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Bottle Size</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-outline transition-transform duration-300 ${openFilters.size ? 'rotate-180' : ''}`} />
        </button>
        <motion.div 
          initial={false}
          animate={{ height: openFilters.size ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-3 space-y-2 ml-4">
            {['250ml', '500ml', '750ml', '1000ml'].map((size) => (
              <label key={size} className="flex items-center gap-3 cursor-pointer group select-none">
                <input 
                  type="checkbox"
                  checked={selectedVolumes[size]}
                  onChange={() => { setSelectedVolumes(prev => ({ ...prev, [size]: !prev[size] })); setCurrentPage(1); }}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-xs font-light ${selectedVolumes[size] ? 'text-primary font-semibold' : ''}`}>
                  {size === '1000ml' ? '1000ml (1L)' : size}
                </span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Region */}
      <div>
        <button 
          onClick={() => toggleFilterGroup('region')}
          className="w-full flex items-center justify-between py-2 text-primary font-bold border-l-2 border-[#d4af37] pl-3 hover:text-secondary transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Verified className="h-4 w-4 text-secondary" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Region</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-outline transition-transform duration-300 ${openFilters.region ? 'rotate-180' : ''}`} />
        </button>
        <motion.div 
          initial={false}
          animate={{ height: openFilters.region ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-3 space-y-2 ml-4">
            {['Cap Bon', 'Sahel', 'Sfax', 'Zaghouan'].map((reg) => (
              <label key={reg} className="flex items-center gap-3 cursor-pointer group select-none">
                <input 
                  type="checkbox"
                  checked={selectedRegions[reg]}
                  onChange={() => { setSelectedRegions(prev => ({ ...prev, [reg]: !prev[reg] })); setCurrentPage(1); }}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-xs font-light ${selectedRegions[reg] ? 'text-primary font-semibold' : ''}`}>
                  {reg}
                </span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg max-w-[1440px] mx-auto px-gutter">
        
        {/* Breadcrumbs & Header Area */}
        <nav className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-label-sm font-mono text-outline uppercase tracking-widest text-[10px]">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <ChevronRight className="h-3 w-3 text-outline-variant" />
            <span className="text-primary font-semibold">Shop</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-left">
              <h1 
                className="font-serif text-primary mb-2 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Artisan Collection
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl text-sm md:text-base font-light leading-relaxed">
                Discover Tunisia's finest extra virgin olive oils, cold-pressed from heritage groves and bottled in limited editions.
              </p>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 min-w-[300px]">
              <span className="font-mono text-xs text-outline font-semibold uppercase tracking-wider">{totalProducts} {totalProducts === 1 ? 'Masterpiece' : 'Masterpieces'}</span>
              
              {/* Custom-styled Sort Dropdown */}
              <div className="flex items-center gap-2 relative border border-outline-variant/30 rounded-xl px-4 py-2 bg-surface hover:border-primary/50 transition-colors select-none">
                <span className="text-label-lg font-mono text-[9px] text-[#d4af37] uppercase font-bold mr-1">Sort:</span>
                <select 
                  value={sortOption} 
                  onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }} 
                  className="appearance-none pr-8 bg-transparent border-none text-primary uppercase text-[10px] font-mono font-bold focus:outline-none cursor-pointer focus:ring-0 py-0"
                >
                  <option className="bg-surface text-on-surface" value="newest">Newest</option>
                  <option className="bg-surface text-on-surface" value="price_asc">Price: Low-High</option>
                  <option className="bg-surface text-on-surface" value="price_desc">Price: High-Low</option>
                  <option className="bg-surface text-on-surface" value="rating">Rating</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Gold to green horizontal baseline separator */}
          <div className="h-[1px] w-full bg-gradient-to-r from-[#d4af37]/45 via-outline-variant/20 to-transparent mt-4"></div>
        </nav>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-end">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-5 py-3 border border-primary text-primary rounded-full uppercase tracking-wider font-mono text-[10px] font-bold shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#d4af37]" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {/* Sidebar Filters (Desktop Sticky Sidebar) */}
          <aside className="hidden lg:block w-72 sticky top-24 shrink-0 h-fit">
            <div className="bg-surface p-8 rounded-2xl border border-outline-variant/10 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              
              <div className="mb-8 flex justify-between items-start relative z-10">
                <div className="text-left">
                  <h2 className="font-serif text-primary text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Refine Selection</h2>
                  <p className="text-label-sm font-mono text-[9px] uppercase tracking-wider mt-1 text-outline">
                    Liquid Gold Filters
                  </p>
                </div>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#1e3d2f]/10 text-[#1e3d2f] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#1e3d2f]/20">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>

              {/* Render Sidebar Filters */}
              <div className="relative z-10">
                {renderFilterGroups()}
              </div>

              <button 
                onClick={resetFilters}
                className="w-full mt-12 py-4 border border-secondary text-secondary font-mono uppercase tracking-widest hover:bg-secondary/5 transition-colors rounded-full text-[10px] font-bold cursor-pointer relative z-10"
              >
                Reset All
              </button>
            </div>

            {/* Redesigned Featured Philosophy Card in Sidebar */}
            <div className="mt-8 relative overflow-hidden rounded-2xl aspect-[4/5] group bg-gradient-to-br from-[#1e3d2f] to-[#0c1813] border border-[#d4af37]/25 shadow-md">
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat z-10" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              
              <div className="absolute inset-0 opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Liquid gold splash"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuB0kk4d_1noLLvoSMZhwxkgDAh4D7h3nNjZy8GH-__BFH2Ko59E3oRfp9qhdaTXMxZ3QuKHfFJRb-ceYFW8wwecsJtDg4MYs_q1CEpn8wWutUz9mdBHY2yPcXZt6ZPlMEcREDFBVsfsW4i32w7C5TLGKM4u4U9vF9Y0kra7DZXbkP7od3aWm4CbW7CZ4U3It1tjvo1MlMswXwAMkI0ylVgMRIgpYotraoqfQ-gGde29ylGh4ZbfvFhw"
                />
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20 text-left">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">
                  Our Philosophy
                </span>
                <h3 
                  className="font-serif mt-2 text-xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  The Cold-Press Secret
                </h3>
                <p className="text-white/70 mt-3 line-clamp-3 text-xs leading-relaxed font-light">
                  Every bottle preserves the polyphenol essence of Tunisia's ancient trees.
                </p>
                <a className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#d4af37] hover:text-[#d4af37]/80 hover:gap-3 transition-all font-bold" href="#">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <section className="flex-grow">
            
            {/* Active Filter Chips / Pills above Grid */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 items-center text-left">
                <span className="font-mono text-[9px] uppercase tracking-widest text-outline mr-2 font-bold">Active Filters:</span>
                {activeChips.map((chip, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-outline-variant/30 text-primary text-xs font-medium rounded-full shadow-sm hover:border-[#d4af37] transition-colors"
                  >
                    <span>{chip.label}</span>
                    <button 
                      onClick={() => removeFilterChip(chip)}
                      className="text-outline-variant hover:text-red-500 focus:outline-none transition-colors cursor-pointer"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-mono uppercase tracking-wider text-secondary hover:text-[#d4af37] font-bold pl-2 cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            {loadingShop || loadingCategories ? (
              /* Grid loading card skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col bg-white rounded-[1.5rem] p-4 border border-outline-variant/10 shadow-sm animate-pulse space-y-4">
                    <div className="aspect-[4/5] rounded-2xl bg-outline-variant/20 w-full"></div>
                    <div className="h-4 bg-outline-variant/20 rounded-md w-1/3"></div>
                    <div className="h-6 bg-outline-variant/20 rounded-md w-3/4"></div>
                    <div className="h-4 bg-outline-variant/20 rounded-md w-5/6"></div>
                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                      <div className="h-6 bg-outline-variant/20 rounded-md w-16"></div>
                      <div className="h-10 bg-outline-variant/20 rounded-full w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : shopProducts.length === 0 ? (
              /* Empty state with reset button */
              <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant space-y-4 bg-surface/30 rounded-2xl border border-outline-variant/10 p-8">
                <Inbox className="h-12 w-12 text-primary opacity-30 mb-2" />
                <p className="font-serif text-lg font-bold text-primary" style={{ fontFamily: "'Fraunces', serif" }}>
                  No masterpieces found in our collection
                </p>
                <p className="text-sm font-light max-w-sm text-center">Try loosening your active filters or clear them completely to browse all products.</p>
                <button 
                  onClick={resetFilters}
                  className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 mt-2"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Product cards grid list using extracted ProductCard */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
                {shopProducts.map((product) => {
                  const productId = product._id || product.id;
                  const isFavorite = wishlist.some(item => (item._id || item.id || item) === productId);
                  return (
                    <ProductCard 
                      key={productId}
                      product={product}
                      isFavorite={isFavorite}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={addToCart}
                      onQuickView={setQuickViewProduct}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-24 flex flex-col items-center gap-6">
                
                {/* Showing XY of Z count label */}
                <span className="text-[10px] text-outline font-mono uppercase tracking-widest font-semibold">
                  Showing {startItem}–{endItem} of {totalProducts} Masterpieces
                </span>

                <div className="flex items-center gap-4 justify-center">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none cursor-pointer" 
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((pageNum, idx) => {
                      if (pageNum === '...') {
                        return (
                          <span key={`dots-${idx}`} className="w-12 text-center text-outline select-none font-mono">
                            &bull;&bull;&bull;
                          </span>
                        );
                      }
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          className={`w-12 h-12 rounded-full transition-colors font-mono text-xs font-bold focus:outline-none cursor-pointer ${
                            currentPage === pageNum 
                              ? 'bg-primary text-white shadow-md' 
                              : 'hover:bg-surface-variant text-primary border border-outline-variant/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Slide-in Mobile Drawer for Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            
            {/* Sidebar drawer content */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-surface shadow-2xl p-8 overflow-y-auto flex flex-col justify-between border-r border-outline-variant/10 text-left"
            >
              <div className="space-y-6 flex-grow relative">
                {/* Texture background details */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat -mx-8 -my-8" style={{ backgroundImage: `url("${noisePattern}")` }}></div>
                
                <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 relative z-10">
                  <div className="text-left">
                    <h2 className="font-serif text-primary text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Refine Selection</h2>
                    <p className="text-label-sm font-mono text-[9px] uppercase tracking-wider text-outline">Liquid Gold Filters</p>
                  </div>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="text-primary hover:text-secondary focus:outline-none cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Render Accordion filter groups */}
                <div className="relative z-10 pt-4">
                  {renderFilterGroups()}
                </div>
              </div>

              <div className="pt-8 relative z-10">
                <button 
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-4 border border-secondary text-secondary font-mono uppercase tracking-widest rounded-full text-[10px] font-bold cursor-pointer hover:bg-secondary/5 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Lightweight Quick View Modal overlay */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full p-8 shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-8 text-left cursor-default border border-outline-variant/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Texture backdrop */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-repeat" style={{ backgroundImage: `url("${noisePattern}")` }}></div>

              <button 
                className="absolute top-4 right-4 text-primary hover:text-secondary transition-colors cursor-pointer z-10"
                onClick={() => setQuickViewProduct(null)}
                aria-label="Close quick view"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/10 relative z-10">
                <img 
                  src={quickViewProduct.images?.[0] || quickViewProduct.image} 
                  alt={quickViewProduct.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-widest block">
                    {quickViewProduct.region} &bull; {quickViewProduct.volume}
                  </span>
                  <h3 
                    className="font-serif text-2xl text-primary font-bold tracking-tight leading-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {quickViewProduct.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="font-mono text-xs font-bold text-primary">
                      {quickViewProduct.rating || 0} / 5
                    </span>
                  </div>
                  
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed line-clamp-4">
                    {quickViewProduct.description}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between mt-6">
                  <span className="font-serif text-2xl text-primary font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                    ${(quickViewProduct.price || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                    className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
