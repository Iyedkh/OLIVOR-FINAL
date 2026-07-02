import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Star, Layers, CreditCard, Package2, Ruler, Verified, ArrowRight, Heart, SlidersHorizontal } from 'lucide-react';

const productsData = [
  {
    id: 'reserve-collection',
    title: 'Reserve Collection',
    price: 48.0,
    rating: 4.9,
    description: 'Our signature single-origin estate blend, noted for its peppery finish and buttery undertones.',
    volume: '500ml',
    region: 'Tunisia',
    badge: 'Harvest 2024',
    badgeType: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ByUjGacuLxWtbDxcz4kGpUSx7s01qJl4bI33eIxuKBrwC76UFi2MgK_xviAlXB2_mM3HKzLcbcD6IXwo6k3Nm5EElOq0YtkV5ed6S1Jiy7V6BEV2C6n1cKVZ3E1EyLmxw0iL4Zp6o9S4oTSGGJZzoHDsKrLTrAlcJSV_zCEOPZ3F-icrieUEaU7Qt5OIOH6afwUkCRR8JfZR69AzXfLflx6_hBvijVE0Qr4tlUYtr8OcNLC5ZMKrMg'
  },
  {
    id: 'chemlali-gold',
    title: 'Chemlali Gold',
    price: 64.0,
    rating: 5.0,
    description: 'A robust, intense oil extracted from ancient trees in the Sahel region.',
    volume: '750ml',
    region: 'Sahel',
    badge: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw8F6qi80OSwtec9Z_SY8xz2Grx2K5ejvwAkNiouUR13bpAFez6UTyb8HCfugcpUAUh--xR0JBzXujEzG3e5xnFehmG1FB_da45Bm8A-Ij7EBmPYyg8iB4JJuh3vSOCdWG28WgIByAOADmC13e5LhBqOyjMR4-9zoKO5lDxFscyXd-Q0xqzNve9Is49DFGxvtBOwjJL9oaFEzoAqXeRZ68ZWDt3sfInXp6-VwYXGL2tfRlsq2VweFfwA'
  },
  {
    id: 'heritage-trio-set',
    title: 'Heritage Trio Set',
    price: 120.0,
    rating: 4.8,
    description: 'A curated discovery flight of our most distinguished varietals in 250ml artisanal bottles.',
    volume: '3x250ml',
    region: 'Multi-Region',
    badge: 'Gift Choice',
    badgeType: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBujlZkatz7C6kyHcSKXMlMnC8w0F28U3XmwRh7Jv_SUd2UpinoitWpt_9Dl7bsGGUo1j7aB_ypeKlmES7IbFelzjv8wflbHLynnHhTwTLuusXTxmEoviZFcI3-fxEl4n_-H-_ojNl4q_mfMGeW-qIyrckJGHdPpim4bwheSZeiYYsnVA8fINwNohnpYLaxXM-9tZauG0bZCTk6DXLw1N3rQDhxlov4DK00x74gFXwTK0Cs0F9Hmy7yUQ'
  },
  {
    id: 'carthage-amphora',
    title: 'Carthage Amphora',
    price: 185.0,
    rating: 4.9,
    description: 'Limited edition hand-thrown ceramic vessel filled with our ultra-premium Early Harvest oil.',
    volume: '1000ml',
    region: 'Cap Bon',
    badge: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF-fCq1OG_kxJ4F6N97IKiMLF_gloGNEMHBsz78RyvnAqlDmNZFSEIsK9CE2XsHJy51hDUnzXseeWjOvyhjLmR8BpUncR4dxUQXEM5taqNi6Oyii4mKzASf73prSI57PFe9m-O_UpBDCBcIK4_TNJ3UszzWc8Hgp4aH8JgtMFhO6E1ORaevBbG6EKVMo5F6wXmnjH2dksY_dUtxALvkCmg3Qsyp500rMefkvDf2_ViyBUEr5nzpw5qzw'
  },
  {
    id: 'black-label-1904',
    title: 'Black Label 1904',
    price: 58.0,
    rating: 5.0,
    description: 'Centenary grove oil, harvested at peak maturity for a smooth, complex profile.',
    volume: '500ml',
    region: 'Sfax',
    badge: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfgSWWoDrdA65U-uLk3i-hAKGUn3BE3dxcmFaOdOKxVqIfY59LeUAFjMgXujhN9bKIbgkq5NIR2kQm52xwB_rooyqs-7mNbWAmoMnO5u22nLEsH4yb80QTEv69er7Bq3K7Pt8_aj2inRkUL4pDvgdWea6FWxCaaol9CKER-DTbbnXtNTVUCT8STsgTxhbQv9d4A6skAm9QTf9MDd8Z-Qu6PYSNG7Ni1RFwKJJtncMT3YjaPOQqF4gfWA'
  },
  {
    id: 'early-harvest-white',
    title: 'Early Harvest White',
    price: 42.0,
    rating: 4.7,
    description: 'Delicate and floral, this oil is perfect for light salads and artisanal cheeses.',
    volume: '500ml',
    region: 'Zaghouan',
    badge: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv6UZoo1OGqI0aKJ7KL3hREhUrnayvsCQjnicd3b_CgYLe30y9xEumhdoLdB3Sz7-VKg3PVmBCfuRFSDjs__09KtXgw4EhagySLUlbt5u2NY6loEe4EGku0fKQzGiWRzuP0ybdNQiuxP2Kv2YQbX3tTObUodE5laKrbETwqfxehorbdxdpMJou2hbAsB0I54FtT4wLx9uHOeNiZz1cfFIKXK_zmLDG06ylSZyiFO9BIIlKkGSjEW3nzQ'
  }
];

const Shop = () => {
  const [favorites, setFavorites] = useState({});
  const [selectedCollections, setSelectedCollections] = useState({
    'Reserve Estate': true,
    'Limited Harvest': false,
    'Infusions': false,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleCheckboxChange = (name) => {
    setSelectedCollections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const resetFilters = () => {
    setSelectedCollections({
      'Reserve Estate': false,
      'Limited Harvest': false,
      'Infusions': false,
    });
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
              <span className="text-label-lg font-label-lg text-outline">24 Masterpieces</span>
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
                    {Object.keys(selectedCollections).map((name) => (
                      <label key={name} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={selectedCollections[name]}
                          onChange={() => handleCheckboxChange(name)}
                          className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-background h-4 w-4"
                        />
                        <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors ${selectedCollections[name] ? 'text-primary font-semibold' : ''}`}>
                          {name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Filter Placeholders */}
                <div className="text-outline flex items-center gap-3 py-3 hover:text-on-surface transition-all cursor-pointer">
                  <CreditCard className="h-5 w-5 text-outline/80" />
                  <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Price Range</span>
                </div>
                
                <div className="text-outline flex items-center gap-3 py-3 hover:text-on-surface transition-all cursor-pointer">
                  <Package2 className="h-5 w-5 text-outline/80" />
                  <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Packaging</span>
                </div>

                <div className="text-outline flex items-center gap-3 py-3 hover:text-on-surface transition-all cursor-pointer">
                  <Ruler className="h-5 w-5 text-outline/80" />
                  <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Bottle Size</span>
                </div>

                <div className="text-outline flex items-center gap-3 py-3 hover:text-on-surface transition-all cursor-pointer">
                  <Verified className="h-5 w-5 text-outline/80" />
                  <span className="text-label-lg font-label-lg uppercase tracking-wider text-xs">Harvest Status</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
              {productsData.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="product-card flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden group border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative aspect-[3/4] bg-surface-container overflow-hidden p-8 flex items-center justify-center">
                    <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                      <img 
                        className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105" 
                        alt={product.title}
                        src={product.image}
                      />
                    </Link>
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className="w-10 h-10 rounded-full bg-white/85 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all focus:outline-none"
                        aria-label="Add to wishlist"
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${favorites[product.id] ? 'fill-secondary text-secondary' : 'text-outline-variant hover:text-secondary'}`} 
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
                      <Link to={`/product/${product.id}`}>
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
                      <button className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-label-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-xs font-semibold">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-24 flex items-center justify-center gap-4">
              <button 
                className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
                disabled
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined block">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-full bg-primary text-white font-label-lg font-bold">1</button>
                <button className="w-12 h-12 rounded-full hover:bg-surface-variant transition-colors font-label-lg font-semibold">2</button>
                <button className="w-12 h-12 rounded-full hover:bg-surface-variant transition-colors font-label-lg font-semibold">3</button>
                <span className="px-2 select-none">...</span>
                <button className="w-12 h-12 rounded-full hover:bg-surface-variant transition-colors font-label-lg font-semibold">8</button>
              </div>
              
              <button 
                className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined block">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Shop;
