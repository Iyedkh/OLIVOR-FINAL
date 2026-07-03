import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Star, Layers, CreditCard, Package2, Ruler, Verified, ArrowRight, Heart, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Shop = () => {
  const { products, wishlist, toggleWishlist, addToCart, loadingProducts, categories, loadingCategories } = useApp();
  const [selectedCollections, setSelectedCollections] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

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

  const filteredProducts = (products || []).filter(p => {
    // 1. Category/Collection filter
    const catName = p.category?.name || p.category;
    const hasCategoryFilters = Object.values(selectedCollections).some(v => v);
    if (hasCategoryFilters && !selectedCollections[catName]) {
      return false;
    }

    // 2. Price filter
    const hasPriceFilters = Object.values(selectedPrices).some(v => v);
    if (hasPriceFilters) {
      let matchPrice = false;
      if (selectedPrices.under50 && p.price < 50) matchPrice = true;
      if (selectedPrices.fiftyToHundred && p.price >= 50 && p.price <= 100) matchPrice = true;
      if (selectedPrices.overHundred && p.price > 100) matchPrice = true;
      if (!matchPrice) return false;
    }

    // 3. Volume/Bottle Size filter
    const hasVolumeFilters = Object.values(selectedVolumes).some(v => v);
    if (hasVolumeFilters) {
      let matchVolume = false;
      const vol = p.volume?.toLowerCase() || '';
      if (selectedVolumes['250ml'] && vol.includes('250ml')) matchVolume = true;
      if (selectedVolumes['500ml'] && vol.includes('500ml')) matchVolume = true;
      if (selectedVolumes['750ml'] && vol.includes('750ml')) matchVolume = true;
      if (selectedVolumes['1000ml'] && (vol.includes('1000ml') || vol.includes('1l'))) matchVolume = true;
      if (!matchVolume) return false;
    }

    // 4. Region filter
    const hasRegionFilters = Object.values(selectedRegions).some(v => v);
    if (hasRegionFilters) {
      const region = p.region || '';
      if (!selectedRegions[region]) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      {/* Main Content Wrapper */}
      <main className="pt-32 pb-section-gap-lg max-w-[1440px] mx-auto px-gutter">
        {/* Breadcrumbs & Header */}
        <nav className="mb-12 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-outline-variant" />
            <span className="text-primary font-semibold">Shop</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2 text-3xl md:text-5xl">
                Artisan Collection
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-base md:text-lg">
                Discover Tunisia's finest extra virgin olive oils, cold-pressed from heritage groves and bottled in limited editions.
              </p>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 border-b border-outline-variant pb-2 min-w-[300px]">
              <span className="text-label-lg text-label-lg text-outline">{filteredProducts.length} {filteredProducts.length === 1 ? 'Masterpiece' : 'Masterpieces'}</span>
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-label-lg font-label-lg text-primary uppercase text-sm font-semibold">Sort: Newest</span>
                <ChevronDown className="h-4 w-4 text-secondary group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </nav>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-end">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg uppercase tracking-wider font-label-lg text-xs"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          {/* SideNavBar (Sticky Sidebar) */}
          <aside className={`lg:h-full w-full lg:w-72 sticky top-24 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-surface p-8 rounded-2xl border border-outline-variant/10">
              <div className="mb-8">
                <h2 className="font-headline-md text-headline-md text-primary text-xl">Refine Selection</h2>
                <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mt-1 text-xs">
                  Liquid Gold Filters
                </p>
              </div>

              <div className="space-y-6">
                {/* Filter Item: Collections */}
                <div>
                  <div className="flex items-center gap-3 py-3 text-primary font-bold border-r-2 border-secondary">
                    <Layers className="h-5 w-5 text-secondary" />
                    <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Collections</span>
                  </div>
                  <div className="mt-2 space-y-2 ml-8">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={!!selectedCollections[cat.name]}
                          onChange={() => handleCheckboxChange(cat.name)}
                          className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-background h-4 w-4"
                        />
                        <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors ${selectedCollections[cat.name] ? 'text-primary font-semibold' : ''}`}>
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex items-center gap-3 py-3 text-primary font-bold border-r-2 border-secondary">
                    <CreditCard className="h-5 w-5 text-secondary" />
                    <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Price Range</span>
                  </div>
                  <div className="mt-2 space-y-2 ml-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedPrices.under50}
                        onChange={() => { setSelectedPrices(prev => ({ ...prev, under50: !prev.under50 })); setCurrentPage(1); }}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-sm ${selectedPrices.under50 ? 'text-primary font-semibold' : ''}`}>
                        Under $50
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedPrices.fiftyToHundred}
                        onChange={() => { setSelectedPrices(prev => ({ ...prev, fiftyToHundred: !prev.fiftyToHundred })); setCurrentPage(1); }}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-sm ${selectedPrices.fiftyToHundred ? 'text-primary font-semibold' : ''}`}>
                        $50 - $100
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedPrices.overHundred}
                        onChange={() => { setSelectedPrices(prev => ({ ...prev, overHundred: !prev.overHundred })); setCurrentPage(1); }}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-sm ${selectedPrices.overHundred ? 'text-primary font-semibold' : ''}`}>
                        Over $100
                      </span>
                    </label>
                  </div>
                </div>

                {/* Bottle Size */}
                <div>
                  <div className="flex items-center gap-3 py-3 text-primary font-bold border-r-2 border-secondary">
                    <Ruler className="h-5 w-5 text-secondary" />
                    <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Bottle Size</span>
                  </div>
                  <div className="mt-2 space-y-2 ml-8">
                    {['250ml', '500ml', '750ml', '1000ml'].map((size) => (
                      <label key={size} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={selectedVolumes[size]}
                          onChange={() => { setSelectedVolumes(prev => ({ ...prev, [size]: !prev[size] })); setCurrentPage(1); }}
                          className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-sm ${selectedVolumes[size] ? 'text-primary font-semibold' : ''}`}>
                          {size === '1000ml' ? '1000ml (1L)' : size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <div className="flex items-center gap-3 py-3 text-primary font-bold border-r-2 border-secondary">
                    <Verified className="h-5 w-5 text-secondary" />
                    <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Region</span>
                  </div>
                  <div className="mt-2 space-y-2 ml-8">
                    {['Cap Bon', 'Sahel', 'Sfax', 'Zaghouan'].map((reg) => (
                      <label key={reg} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={selectedRegions[reg]}
                          onChange={() => { setSelectedRegions(prev => ({ ...prev, [reg]: !prev[reg] })); setCurrentPage(1); }}
                          className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors text-sm ${selectedRegions[reg] ? 'text-primary font-semibold' : ''}`}>
                          {reg}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={resetFilters}
                className="w-full mt-12 py-4 border border-secondary text-secondary font-label-lg uppercase tracking-widest hover:bg-secondary/5 transition-colors rounded-lg text-xs font-bold"
              >
                Reset All
              </button>
            </div>

            {/* Featured Card in Sidebar */}
            <div className="mt-8 relative overflow-hidden rounded-2xl aspect-[4/5] group bg-primary">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Liquid gold splash"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuB0kk4d_1noLLvoSMZhwxkgDAh4D7h3nNjZy8GH-__BFH2Ko59E3oRfp9qhdaTXMxZ3QuKHfFJRb-ceYFW8wwecsJtDg4MYs_q1CEpn8wWutUz9mdBHY2yPcXZt6ZPlMEcREDFBVsfsW4i32w7C5TLGKM4u4U9vF9Y0kra7DZXbkP7od3aWm4CbW7CZ4U3It1tjvo1MlMswXwAMkI0ylVgMRIgpYotraoqfQ-gGde29ylGh4ZbfvFhw"
                />
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                <span className="text-label-sm font-label-sm uppercase tracking-widest opacity-80 text-xs">
                  Our Philosophy
                </span>
                <h3 className="font-headline-md text-headline-md mt-2 text-lg md:text-xl">
                  The Cold-Press Secret
                </h3>
                <p className="text-body-md text-white/70 mt-3 line-clamp-3 text-sm">
                  Every bottle preserves the polyphenol essence of Tunisia's ancient trees.
                </p>
                <a className="mt-4 flex items-center gap-2 font-label-lg text-secondary-fixed hover:gap-4 transition-all text-xs font-semibold" href="#">
                  Learn more <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-grow">
            {loadingProducts || loadingCategories ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl opacity-30 mb-4">inventory_2</span>
                <p className="font-body-lg">No masterpieces found in our collection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
                {currentProducts.map((product) => {
                  const productId = product._id || product.id;
                  const isFavorite = wishlist.some(item => (item._id || item.id || item) === productId);
                  return (
                    <motion.div 
                      key={productId}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="product-card flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden group border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative aspect-[3/4] bg-surface-container overflow-hidden">
                        <Link to={`/product/${productId}`} className="w-full h-full block">
                          <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            alt={product.title}
                            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                          />
                        </Link>
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button 
                            onClick={() => toggleWishlist(productId)}
                            className="w-10 h-10 rounded-full bg-white/85 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all focus:outline-none"
                            aria-label="Add to wishlist"
                          >
                            <Heart 
                              className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-secondary text-secondary' : 'text-outline-variant hover:text-secondary'}`} 
                            />
                          </button>
                        </div>

                        {product.badge && (
                          <div className="absolute bottom-4 left-4">
                            <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider text-xs ${
                              product.badgeType === 'secondary' 
                                ? 'bg-secondary/15 text-secondary' 
                                : 'bg-primary/15 text-primary'
                            }`}>
                              {product.badge}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/product/${productId}`}>
                            <h3 className="font-headline-md text-headline-md text-primary hover:text-secondary transition-colors text-lg md:text-xl">
                              {product.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1 text-secondary">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span className="text-label-sm font-label-sm font-semibold">{product.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4 text-sm font-light">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-label-sm font-label-sm text-outline uppercase tracking-widest mb-6 text-xs font-semibold">
                          <span>{product.region}</span>
                          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                          <span>{product.volume}</span>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/20">
                          <span className="font-headline-md text-headline-md text-on-surface text-lg md:text-xl">
                            ${product.price.toFixed(2)}
                          </span>
                          <button 
                            onClick={() => addToCart(product, 1)}
                            className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-label-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-xs font-semibold"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none" 
                  aria-label="Previous page"
                >
                  <span className="material-symbols-outlined block">chevron_left</span>
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button 
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                      className={`w-12 h-12 rounded-full transition-colors font-label-lg font-bold focus:outline-none ${
                        currentPage === pageNum 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-surface-variant text-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none"
                  aria-label="Next page"
                >
                  <span className="material-symbols-outlined block">chevron_right</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Shop;
