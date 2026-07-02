import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Plus, Minus, ZoomIn, ChevronDown, Award, Sprout, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const galleryImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvCDTtUsXIuLOLgDKfWQX7TtvAPEiXLW1qHkglddu-DKTduowXMaGrx4h4vqJg17LUTwQamYBF7Qoz7pqfj8IVxgbs7F-CB220KsH86tFELyI94Neq2aFhVRmDMMZdLrgWBoNy-yxI8DoAtFTnveV3UnKh5S2pgqIKyrRLcRZSOSmMkpBCX3oRtDkfVORs4o3qYJiXzRVoXS9n4FxyG9CKt_KkLJir3k0x_-uZq08bNTsskcYTvnqF6w',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTPIHgqoCrNuvCJXzR_CiKl3-Xyqy_Up_XO2a81SdKKOiSicpaKBy39ZW71WEiDch5ZcjRTs_A0OmEHSzkVvliqy7LNvLwBp7L5Ajp2YsbpXr5lY7iJ3r8_tk4Rf68l2WY5Tv_sxq1M7vaE2c6DzdmEaSAzZvgrEtGzGdEC92qrR-cg8CI-E3sc4A5crESqcOWIPhRx4DfIKcp85n7te3EfJL9S9HV4uUh8fFzdzMGlJmZQBHHvU4VOg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPa_LAL0fQbWlp6v9Z7Oqn2ahe8Tep1vqVbyQGZK_TOlYsX4ssBq98tdYtki3mKan9w4DI4m4fumC3T7RjOSQm-J2Cdk9ureAlY6uvT5mt-Kc8fLBLaKOp-kbCYUd08ukH4UZ4I4G49JCofzs34ARXwTVPanPTeYp6CDr-MuZpzvxgHpLkjEwehNsuy7GH6mUDMi6hAPiOebDmDKTLJtVVQ_pAD2T1j3hfvj8wUTPOFIEuopJF7_ZRrA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsmlQn7DSuvj_dNW1Bswa5WWA8dJu7X1rdwsHEhBesk5DRsymX71m5SMe5-4nSRq6Lxdn_mJQp62OuhDyEhyhKccvMp-kfbsVuAOKbXnXBjj0K80WIbDk5Vb99dBZTqYYwirYjfA6zvi9BVxBXdFrfEEhPAG3-qiWQqmWV46EdDB7no8AkRqIqOurJjp9lvTLn37Pm2w9oXCuL4TWv1O2Dgbd_PTsK5CHZJU389-XBhCd2_HuEfzlxLw'
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, loadingProducts, wishlist, toggleWishlist } = useApp();
  
  const product = products.find(p => (p._id || p.id) === id);

  const isInWishlist = product && (wishlist || []).some(
    item => (item._id || item.id || item) === (product._id || product.id)
  );

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.volume || '500ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [openFaq, setOpenFaq] = useState(null);

  const similarProducts = products
    ? products.filter(p => (p._id || p.id) !== id).slice(0, 4)
    : [];

  if (loadingProducts) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center text-center p-6 pt-32">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">sentiment_dissatisfied</span>
        <h2 className="font-headline-lg text-primary text-2xl mb-4 font-bold">Product Not Found</h2>
        <p className="text-on-surface-variant max-w-md mb-8">The premium olive oil blend you are looking for does not exist or has been removed from our cellars.</p>
        <Link to="/shop" className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image, ...galleryImages.slice(1)] : galleryImages);

  const handleQtyChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <main className="pt-32 pb-section-gap-lg max-w-[1440px] mx-auto px-gutter">
        
        {/* Breadcrumbs */}
        <nav className="mb-12 flex items-center gap-2 text-label-sm font-label-sm text-outline uppercase tracking-widest text-xs">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">{product.title}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Cinematic Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            
            {/* Vertical Thumbnails */}
            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible scroller-hide select-none">
              {productImages.map((imgUrl, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                    selectedImgIdx === idx ? 'border-primary' : 'border-outline-variant hover:border-primary'
                  }`}
                >
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url('${imgUrl}')` }}
                  ></div>
                </button>
              ))}
            </div>

            {/* Main Display with Active Thumbnail */}
            <div className="order-1 md:order-2 flex-grow relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low group cursor-crosshair select-none border border-outline-variant/10">
              <motion.div 
                key={selectedImgIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
                style={{ backgroundImage: `url('${productImages[selectedImgIdx]}')` }}
              ></motion.div>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="absolute bottom-6 right-6 bg-surface/85 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/30 flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-primary" />
                <span className="text-label-sm font-label-lg uppercase tracking-tight text-on-surface text-xs font-semibold">Zoom</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest text-xs font-bold border border-secondary/15 select-none">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                Limited Release
              </span>
              <h1 className="font-display-lg text-headline-xl text-primary leading-tight text-3xl md:text-5xl">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex text-secondary select-none">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {i < Math.floor(product.rating || 5) ? 'star' : 'star_half'}
                    </span>
                  ))}
                </div>
                <span className="text-outline font-label-lg text-label-lg text-xs font-semibold uppercase tracking-wider">
                  {product.rating || 5.0} / 5 (128 Reviews)
                </span>
              </div>
              <div className="text-3xl font-headline-md text-primary font-bold">${(product.price || 0.00).toFixed(2)}</div>
            </div>

            <p className="text-body-lg text-on-surface-variant font-light leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-6 pt-4 border-t border-outline-variant/20">
              <div className="space-y-3">
                <label className="font-label-lg text-label-lg uppercase tracking-wider text-outline text-xs font-bold">
                  Select Size
                </label>
                <div className="flex gap-4">
                  {['250ml', '500ml', '750ml'].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 border-2 font-semibold rounded-xl transition-all focus:outline-none text-sm ${
                        selectedSize === size 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-outline-variant hover:border-primary text-on-surface-variant'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Quantity select */}
                <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2 bg-surface">
                  <button 
                    onClick={() => handleQtyChange('dec')}
                    className="p-2 hover:text-primary focus:outline-none transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input 
                    className="w-12 text-center bg-transparent border-none focus:ring-0 font-label-lg text-label-lg text-primary font-bold focus:outline-none pointer-events-none" 
                    readOnly 
                    type="number" 
                    value={quantity}
                  />
                  <button 
                    onClick={() => handleQtyChange('inc')}
                    className="p-2 hover:text-primary focus:outline-none transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-grow flex gap-4">
                  <button 
                    onClick={() => addToCart(product, quantity)}
                    className="flex-grow bg-primary hover:bg-primary-container text-white py-4 rounded-full font-label-lg text-label-lg uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs font-bold cursor-pointer"
                  >
                    Add to Cart
                  </button>

                  <button 
                    onClick={() => toggleWishlist(product._id || product.id)}
                    className={`px-5 border-2 rounded-full transition-all focus:outline-none flex items-center justify-center cursor-pointer ${
                      isInWishlist 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-outline-variant text-outline hover:text-primary hover:border-primary'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-primary' : ''}`} />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleBuyNow}
                className="w-full border-2 border-secondary text-secondary py-4 rounded-full font-headline-md text-label-lg uppercase tracking-widest hover:bg-secondary/5 transition-all text-xs font-bold"
              >
                Buy Now
              </button>
            </div>

            {/* Certifications Summary */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-outline-variant/30">
              <div className="flex items-center gap-4">
                <Sprout className="h-8 w-8 text-primary shrink-0" />
                <span className="font-label-sm text-label-sm leading-tight text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
                  100% Organic<br />Certified
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-primary shrink-0" />
                <span className="font-label-sm text-label-sm leading-tight text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
                  Cold Pressed<br />Extraction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections (Tabs) */}
        <section className="mt-section-gap-lg text-left">
          <div className="border-b border-outline-variant/30 flex gap-12 overflow-x-auto scroller-hide select-none">
            {['Description', 'Harvest Info', 'Extraction & Storage', 'Nutritional Facts'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 px-2 font-label-lg text-label-lg uppercase tracking-widest text-xs font-bold transition-all duration-300 focus:outline-none whitespace-nowrap relative ${
                  activeTab === tab ? 'text-primary font-semibold' : 'text-outline hover:text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <AnimatePresence mode="wait">
              {activeTab === 'Description' && (
                <motion.div 
                  key="Description"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
                    The Essence of Tunisia
                  </h3>
                  <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                    Each drop of our Reserve Collection is a testament to the sun-soaked terroir of the Sahel. We harvest only during the first full moon of October, ensuring the polyphenols are at their peak intensity. The result is a robust, complex oil that dances between bitterness and fruitiness.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                      <span className="text-body-md text-on-surface-variant font-light text-sm">
                        Single-estate origin from Mahdia, Tunisia.
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                      <span className="text-body-md text-on-surface-variant font-light text-sm">
                        Acidity level below 0.2%—truly superior grade.
                      </span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'Harvest Info' && (
                <motion.div 
                  key="Harvest"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
                    October lunar harvest
                  </h3>
                  <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                    Harvesting by hand at night under a full moon preserves the cool temperature of the fruit, ensuring the delicate flavor volatiles and heavy antioxidant compounds are preserved in their natural state.
                  </p>
                  <ul className="space-y-3 text-sm text-on-surface-variant font-light">
                    <li><strong>Varietal:</strong> 100% Chemlali olives</li>
                    <li><strong>Orchard:</strong> Mahdia Coastline, Tunisian Sahel</li>
                    <li><strong>Method:</strong> 100% Hand-picked</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'Extraction & Storage' && (
                <motion.div 
                  key="Extraction"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
                    Under 24-Hour Cold Press
                  </h3>
                  <p className="text-body-lg leading-relaxed text-on-surface-variant text-sm md:text-base font-light">
                    We transport the fruit immediately from the grove to our temperature-regulated local mill. Cold mechanical extraction occurs under nitrogen blanket within 4 hours of arrival to completely eliminate oxidation.
                  </p>
                </motion.div>
              )}

              {activeTab === 'Nutritional Facts' && (
                <motion.div 
                  key="Nutrition"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 max-w-md"
                >
                  <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
                    Composition
                  </h3>
                  <div className="divide-y divide-outline-variant/20 text-sm text-on-surface-variant font-light">
                    <div className="flex justify-between py-2"><span>Serving Size</span><span>1 tbsp (15ml)</span></div>
                    <div className="flex justify-between py-2"><span>Calories</span><span>120</span></div>
                    <div className="flex justify-between py-2"><span>Total Fat</span><span>14g (22% DV)</span></div>
                    <div className="flex justify-between py-2"><span>Saturated Fat</span><span>2g</span></div>
                    <div className="flex justify-between py-2"><span>Monounsaturated Fat</span><span>10g</span></div>
                    <div className="flex justify-between py-2"><span>Polyphenols</span><span>450 mg/kg</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-surface-container rounded-2xl p-10 flex items-center justify-center relative overflow-hidden h-[300px] border border-outline-variant/10">
              <div 
                className="absolute inset-0 opacity-10 bg-cover bg-center" 
                style={{ 
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVOhZBK2x00SxuS4gDeJjwKNHPvcS0mituRgfeKcNoNabVhhpkduKENcIQtcygkZHvqYCyFC1lF9eQ72deWOgTsYGzeeeMQ05KJ2wb7e6Rx9pnotqEREdBB23Df9d_X0zwcisiypqQcV3Q-3_ylk6fV9DUTxp-QcBMcqfHYXDDdzlDAUbFg_j0T50Ior8hsuqLlG5y_y4Ist345uCUmXSyW8hoOgTZZzYPl0NvyDUh_t0uXY4nQtkvSw')` 
                }}
              ></div>
              <div className="relative z-10 text-center space-y-4">
                <div className="font-display-lg text-display-lg text-primary opacity-20 text-6xl">2024</div>
                <div className="font-headline-md text-headline-md text-secondary text-xl font-bold">Vintage Harvest</div>
                <p className="text-label-lg uppercase tracking-[0.2em] text-outline text-xs font-semibold">
                  Batch No. 0042 / 1000
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & FAQ */}
        <section className="mt-section-gap-lg grid grid-cols-1 lg:grid-cols-2 gap-24 text-left">
          {/* Testimonials */}
          <div className="space-y-12">
            <h3 class="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
              Customer Reflections
            </h3>
            
            <div className="space-y-8">
              <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm">
                <div className="flex gap-1 text-secondary mb-4 select-none">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="italic text-body-lg text-on-surface-variant mb-6 text-sm font-light leading-relaxed">
                  "An absolute revelation. The depth of flavor is unlike anything I've purchased in boutique stores. It's liquid gold indeed."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                    EM
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface text-sm font-bold">Eleanor M.</p>
                    <p className="text-label-sm text-outline text-xs uppercase tracking-wider">Verified Connoisseur</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm">
                <div className="flex gap-1 text-secondary mb-4 select-none">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="italic text-body-lg text-on-surface-variant mb-6 text-sm font-light leading-relaxed">
                  "The packaging alone is a work of art, but the oil itself is the true star. Perfect for finishing roasted vegetables."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface text-sm font-bold">Julian D.</p>
                    <p className="text-label-sm text-outline text-xs uppercase tracking-wider">Private Chef</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-12">
            <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
              Curated Questions
            </h3>
            
            <div className="space-y-4">
              {[
                {
                  q: 'How should I store this reserve oil?',
                  a: 'Keep in a cool, dark place away from heat sources. Our dark glass protects against UV, but direct sunlight should be avoided to preserve the antioxidant properties.'
                },
                {
                  q: 'What is the shelf life?',
                  a: 'Best consumed within 18 months of harvest for peak flavor. Once opened, we recommend using it within 3-4 months.'
                },
                {
                  q: 'Is it suitable for high-heat cooking?',
                  a: 'While EVOO has a stable smoke point, we recommend using the Reserve Collection as a finishing oil to appreciate its complex aromatic profile.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-outline-variant/30 py-4 cursor-pointer group">
                  <div 
                    onClick={() => toggleFaq(idx)}
                    className="flex justify-between items-center group-hover:text-primary transition-colors select-none"
                  >
                    <span className="font-label-lg text-label-lg uppercase tracking-wider text-xs md:text-sm font-semibold text-primary">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-secondary shrink-0"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={false}
                    animate={{ height: openFaq === idx ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-body-md text-on-surface-variant leading-relaxed text-sm font-light">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Similar Treasures */}
        <section className="mt-section-gap-lg text-left">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-secondary font-label-lg text-label-lg uppercase tracking-[0.2em] mb-2 block text-xs font-bold">
                Curation
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary text-xl md:text-3xl">
                Similar Treasures
              </h3>
            </div>
            
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all focus:outline-none">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white transition-all focus:outline-none">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="flex gap-8 overflow-x-auto scroller-hide pb-10 select-none">
            {similarProducts.map((prod) => {
              const prodId = prod._id || prod.id;
              return (
                <Link 
                  to={`/product/${prodId}`} 
                  key={prodId} 
                  className="min-w-[280px] md:min-w-[320px] group cursor-pointer border border-outline-variant/10 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container mb-6 relative flex items-center justify-center p-4">
                    <img 
                      className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" 
                      alt={prod.title}
                      src={prod.image}
                    />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-1 text-lg truncate">
                    {prod.title}
                  </h4>
                  <p className="text-outline font-label-sm text-label-sm uppercase tracking-widest mb-3 text-[10px] font-semibold">
                    {prod.region} &bull; {prod.volume}
                  </p>
                  <div className="text-secondary font-bold mt-auto">${prod.price.toFixed(2)}</div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default ProductDetail;
